import type { NodeTypes } from "@xyflow/react"
import { ConstantNode, NumberInputNode } from "./nodes/NumberInputNode"
import { VariableNode } from "./nodes/VariableNode"
import { ExpressionNode } from "./nodes/ExpressionNode"
import {
  AddNode,
  SubtractNode,
  MultiplyNode,
  DivideNode,
} from "./nodes/ArithmeticNodes"
import { PowerNode, RootNode, SqrtNode } from "./nodes/PowerNodes"
import {
  TrigonometricNode,
  LnNode,
  LogNode,
  ComparatorNode,
} from "./nodes/ScientificNodes"
import { DerivativeNode, IntegralNode } from "./nodes/CalculusNodes"
import { PlotNode } from "./nodes/PlotNode"
import { MatrixNode } from "./nodes/MatrixNode"
import { GroupNode } from "./nodes/GroupNode"

export const nodeTypes: NodeTypes = {
  numberInput: NumberInputNode,
  constant: ConstantNode,
  variable: VariableNode,
  expression: ExpressionNode,
  add: AddNode,
  subtract: SubtractNode,
  multiply: MultiplyNode,
  divide: DivideNode,
  power: PowerNode,
  root: RootNode,
  sqrt: SqrtNode,
  trigonometric: TrigonometricNode,
  ln: LnNode,
  log: LogNode,
  comparator: ComparatorNode,
  derivative: DerivativeNode,
  integral: IntegralNode,
  plot: PlotNode,
  matrix: MatrixNode,
  group: GroupNode,
}
