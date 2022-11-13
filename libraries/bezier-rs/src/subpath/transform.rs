use super::*;

/// Functionality that transform Beziers, such as split, reduce, offset, etc.
impl Subpath {
	pub fn offset(&self, distance: f64) -> Subpath {
		let beziers = self.iter().flat_map(|bezier| bezier.offset(distance)).collect::<Vec<Bezier>>();
		Subpath::from_beziers(beziers, self.closed)
	}
}
