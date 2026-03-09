import type { NodeTypes } from "@xyflow/react"
import {
  ConstantNode,
  NumberInputNode,
} from "../features/flow/nodes/NumberInputNode"
import { VariableNode } from "../features/flow/nodes/VariableNode"
import { ExpressionNode } from "../features/flow/nodes/ExpressionNode"
import {
  AddNode,
  SubtractNode,
  MultiplyNode,
  DivideNode,
} from "../features/flow/nodes/ArithmeticNodes"
import {
  PowerNode,
  RootNode,
  SqrtNode,
} from "../features/flow/nodes/PowerNodes"
import {
  TrigonometricNode,
  LnNode,
  LogNode,
  ComparatorNode,
} from "../features/flow/nodes/ScientificNodes"
import {
  DerivativeNode,
  IntegralNode,
} from "../features/flow/nodes/CalculusNodes"
import { PlotNode } from "../features/flow/nodes/PlotNode"
import { MatrixNode } from "../features/flow/nodes/MatrixNode"
import { GroupNode } from "../features/flow/nodes/GroupNode"

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
