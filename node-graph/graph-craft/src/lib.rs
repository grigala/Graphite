use graphene_core::ops::Dynamic;
use graphene_core::structural::*;
use graphene_core::value::ValueNode;
use graphene_core::Node;

use dyn_any::DynAny;

#[cfg(test)]
mod tests {

	use graphene_core::ops::{Dynamic, DynamicAddNode};
	use graphene_core::Node;

	use super::*;

	#[test]
	fn dynamic_proto_node() {
		assert_eq!(4, *dyn_any::downcast::<u32>(DynamicAddNode.eval((Box::new(2_u32) as Dynamic, Box::new(2_u32) as Dynamic))).unwrap());
	}

	#[test]
	fn simple_add_network() {
		let add = InstantiatedNode::new("Add", vec![NodeInput::Value(Box::new(2_i32)), NodeInput::Value(Box::new(2_i32))]);

		let _node_graph = InstantiatedNodeGraph::new([add]);
		//node_graph.construct_executor(0).eval(());

		let result = 4;
		assert_eq!(result, 4);
	}

	#[test]
	fn node_as_input_network() {
		let add1 = InstantiatedNode::new("Add", vec![NodeInput::Value(Box::new(6_i32)), NodeInput::Value(Box::new(4_i32))]);
		let add2 = InstantiatedNode::new("Add", vec![NodeInput::Node(0), NodeInput::Value(Box::new(2_i32))]);

		let _node_graph = InstantiatedNodeGraph::new([add1, add2]);
		//node_graph.construct_executor(1).eval(());

		let result = 12;
		assert_eq!(result, 12);
	}
}

/// A unique identifier for each node that has been placed into a graph.
pub type NodeId = usize;
/// An identifier for the type of node (i.e. all greyscale nodes have the same [`NodeType`] but a saturate nodes has a different [`NodeType`])
pub type NodeType = &'static str;

/// Describes the input that goes into a field of a node that has been placed in the graph. Can either come from a link from another node or from a value (inputted into the UI).
pub enum NodeInput<'a> {
	Node(NodeId),
	Value(Box<dyn DynAny<'a>>),
}

/// Describes a node that has been placed in the graph.
///
/// This representation will be sent to the frontend.
pub struct InstantiatedNode<'a> {
	node_type: NodeType,
	inputs: Vec<NodeInput<'a>>,
}

impl<'a> InstantiatedNode<'a> {
	#[inline]
	pub fn new(node_type: NodeType, inputs: Vec<NodeInput<'a>>) -> Self {
		Self { node_type, inputs }
	}
}

/// Stores all the nodes that have been placed in the graph in an arbitrary order.
pub struct InstantiatedNodeGraph<'a> {
	nodes: Vec<InstantiatedNode<'a>>,
}

impl<'a> InstantiatedNodeGraph<'a> {
	#[inline]
	pub fn new(nodes: impl Into<Vec<InstantiatedNode<'a>>>) -> Self {
		Self { nodes: nodes.into() }
	}

	/// Construct proto graph for a particular input
	fn construct_input(input: &NodeInput) -> Box<dyn Node<(), Output = Dynamic<'static>>> {
		match &input {
			NodeInput::Node(_) => todo!(), // self.construct_executor(id),
			NodeInput::Value(v) => Box::new(ValueNode(v)),
		};
		Box::new(ValueNode(Box::new(3) as Box<dyn DynAny>))
	}

	pub fn construct_executor(&self, node: NodeId) {
		let node = &self.nodes[node];

		let mut inputs = node.inputs.iter();
		if let Some(first) = inputs.next() {
			let _result = Self::construct_input(first);
			for input in inputs {
				let _input = Self::construct_input(input);

				// I am trying to evaluate boxed dyn Nodes but I get `the size of `dyn Node<(), Output = Box<dyn DynAny<'_>>>` cannot be statically determined`
				//input.as_ref().eval(());

				// result = Box::new(BoxedComposition {
				// 	first: result as Box<dyn RefNode<(), Output = &'a Dynamic<'a>>>,
				// 	second: ConsNode(input),
				// });
			}
		}

		// let node_executor = match node.node_type {
		// 	"Add" => self
		// 		.construct_input(inputs.next().expect("Should have input"))
		// 		.then_boxed(ConsNode(self.construct_input(inputs.next().expect("Should have input")))),
		// 	node_ty => panic!("Unknown node type {node_ty}"),
		// };

		// node_executor
	}
}
