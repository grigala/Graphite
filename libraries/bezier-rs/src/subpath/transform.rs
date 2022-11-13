use super::*;

/// Functionality that transform Beziers, such as split, reduce, offset, etc.
impl Subpath {
	pub fn offset(&self, distance: f64) -> Subpath {
		let mut bezier_groups = self
			.iter()
			.map(|bezier| bezier.offset(distance))
			.filter(|bezier_group| !bezier_group.is_empty())
			.collect::<Vec<Vec<Bezier>>>();

		// Trim groups which intersect
		// TODO: Intersection may occur earlier / later within the subpath groups (Ex. between second last and second beziers of the groups). Trim instead at the first Subpath intersection.
		for i in 0..bezier_groups.len() - 1 + (self.closed as usize) {
			let second_group_index = (i + 1) % bezier_groups.len();
			let last_bezier_index = bezier_groups[i].len() - 1;

			let bezier1 = bezier_groups[i][last_bezier_index];
			let bezier2 = bezier_groups[second_group_index][0];

			let bezier1_intersections = bezier1.intersections(&bezier2, None);
			if bezier1_intersections.is_empty() {
				continue;
			}
			let bezier2_intersections = bezier2.intersections(&bezier1, None);

			bezier_groups[i][last_bezier_index] = bezier1.trim(0., bezier1_intersections[0]);
			bezier_groups[second_group_index][0] = bezier2.trim(bezier2_intersections[0], 1.);
		}

		let beziers = bezier_groups.into_iter().flatten().collect();
		Subpath::from_beziers(beziers, self.closed)
	}
}
