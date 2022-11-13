use super::*;
use crate::compare::*;
use crate::consts::*;
use std::fmt::Write;

/// Functionality relating to core `Subpath` operations, such as constructors and `iter`.
impl Subpath {
	/// Create a new `Subpath` using a list of [ManipulatorGroup]s.
	/// A `Subpath` with less than 2 [ManipulatorGroup]s may not be closed.
	pub fn new(manipulator_groups: Vec<ManipulatorGroup>, closed: bool) -> Self {
		assert!(!closed || manipulator_groups.len() > 1, "A closed Subpath must contain more than 1 ManipulatorGroup.");
		Self { manipulator_groups, closed }
	}

	/// Create a `Subpath` consisting of 2 manipulator groups from a `Bezier`.
	pub fn from_bezier(bezier: Bezier) -> Self {
		Subpath::new(
			vec![
				ManipulatorGroup {
					anchor: bezier.start(),
					in_handle: None,
					out_handle: bezier.handle_start(),
				},
				ManipulatorGroup {
					anchor: bezier.end(),
					in_handle: bezier.handle_end(),
					out_handle: None,
				},
			],
			false,
		)
	}

	/// Create a subpath from a list of beziers. If two consecutive Bezier do not share an end and start point,
	/// this function uses the `Bezier::join` function to bridge the gap.
	pub fn from_beziers(beziers: Vec<Bezier>, closed: bool) -> Self {
		assert!(!closed || beziers.len() > 1, "A closed Subpath must contain at least 1 Bezier.");
		if beziers.is_empty() {
			return Subpath::new(vec![], closed);
		}
		let first = beziers.first().unwrap();
		let last = beziers.last().unwrap();

		let mut manipulator_groups = vec![ManipulatorGroup {
			anchor: first.start(),
			in_handle: None,
			out_handle: first.handle_start(),
		}];
		let mut inner_groups: Vec<ManipulatorGroup> = beziers
			.windows(2)
			.flat_map(|bezier_pair| {
				if compare_points(bezier_pair[0].end(), bezier_pair[1].start()) {
					vec![ManipulatorGroup {
						anchor: bezier_pair[0].start(),
						in_handle: bezier_pair[0].handle_end(),
						out_handle: bezier_pair[1].handle_start(),
					}]
				} else {
					let joining_bezier = bezier_pair[0].join(bezier_pair[1]);
					vec![
						ManipulatorGroup {
							anchor: bezier_pair[0].end(),
							in_handle: bezier_pair[0].handle_end(),
							out_handle: joining_bezier.handle_start(),
						},
						ManipulatorGroup {
							anchor: bezier_pair[1].start(),
							in_handle: joining_bezier.handle_end(),
							out_handle: bezier_pair[1].handle_start(),
						},
					]
				}
			})
			.collect::<Vec<ManipulatorGroup>>();
		manipulator_groups.append(&mut inner_groups);

		if !closed {
			manipulator_groups.push(ManipulatorGroup {
				anchor: last.end(),
				in_handle: first.handle_end(),
				out_handle: None,
			});
			return Subpath::new(manipulator_groups, false);
		}

		if compare_points(first.start(), last.end()) {
			manipulator_groups[0].in_handle = last.handle_end();
		} else {
			let joining_bezier = last.join(*first);
			manipulator_groups.push(ManipulatorGroup {
				anchor: last.end(),
				in_handle: last.handle_end(),
				out_handle: joining_bezier.handle_start(),
			});
			manipulator_groups[0].in_handle = joining_bezier.handle_end();
		}

		Subpath::new(manipulator_groups, true)
	}

	/// Returns true if the `Subpath` contains no [ManipulatorGroup].
	pub fn is_empty(&self) -> bool {
		self.manipulator_groups.is_empty()
	}

	/// Returns the number of [ManipulatorGroup]s contained within the `Subpath`.
	pub fn len(&self) -> usize {
		self.manipulator_groups.len()
	}

	/// Returns an iterator of the [Bezier]s along the `Subpath`.
	pub fn iter(&self) -> SubpathIter {
		SubpathIter { sub_path: self, index: 0 }
	}

	/// Appends to the `svg` mutable string with an SVG shape representation of the curve.
	pub fn curve_to_svg(&self, svg: &mut String, attributes: String) {
		let curve_start_argument = format!("{SVG_ARG_MOVE}{} {}", self[0].anchor.x, self[0].anchor.y);
		let mut curve_arguments: Vec<String> = self.iter().map(|bezier| bezier.svg_curve_argument()).collect();
		if self.closed {
			curve_arguments.push(String::from(SVG_ARG_CLOSED));
		}

		let _ = write!(svg, r#"<path d="{} {}" {attributes}/>"#, curve_start_argument, curve_arguments.join(" "));
	}

	/// Appends to the `svg` mutable string with an SVG shape representation of the handle lines.
	pub fn handle_lines_to_svg(&self, svg: &mut String, attributes: String) {
		let handle_lines: Vec<String> = self.iter().filter_map(|bezier| bezier.svg_handle_line_argument()).collect();
		let _ = write!(svg, r#"<path d="{}" {attributes}/>"#, handle_lines.join(" "));
	}

	/// Appends to the `svg` mutable string with an SVG shape representation of the anchors.
	pub fn anchors_to_svg(&self, svg: &mut String, attributes: String) {
		let anchors = self
			.manipulator_groups
			.iter()
			.map(|point| format!(r#"<circle cx="{}" cy="{}" {attributes}/>"#, point.anchor.x, point.anchor.y))
			.collect::<Vec<String>>();
		let _ = write!(svg, "{}", anchors.concat());
	}

	/// Appends to the `svg` mutable string with an SVG shape representation of the handles.
	pub fn handles_to_svg(&self, svg: &mut String, attributes: String) {
		let handles = self
			.manipulator_groups
			.iter()
			.flat_map(|group| [group.in_handle, group.out_handle])
			.flatten()
			.map(|handle| format!(r#"<circle cx="{}" cy="{}" {attributes}/>"#, handle.x, handle.y))
			.collect::<Vec<String>>();
		let _ = write!(svg, "{}", handles.concat());
	}

	/// Returns an SVG representation of the `Subpath`.
	/// Appends to the `svg` mutable string with an SVG shape representation that includes the curve, the handle lines, the anchors, and the handles.
	pub fn to_svg(&self, svg: &mut String, curve_attributes: String, anchor_attributes: String, handle_attributes: String, handle_line_attributes: String) {
		if !curve_attributes.is_empty() {
			self.curve_to_svg(svg, curve_attributes);
		}
		if !handle_line_attributes.is_empty() {
			self.handle_lines_to_svg(svg, handle_line_attributes);
		}
		if !anchor_attributes.is_empty() {
			self.anchors_to_svg(svg, anchor_attributes);
		}
		if !handle_attributes.is_empty() {
			self.handles_to_svg(svg, handle_attributes);
		}
	}
}
