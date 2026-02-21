import type { NodeTypes } from "@xyflow/react";
import { NumberInputNode } from "./nodes/NumberInputNode";
import { VariableNode } from "./nodes/VariableNode";
import { ExpressionNode } from "./nodes/ExpressionNode";
import {
  AddNode,
  SubtractNode,
  MultiplyNode,
  DivideNode,
} from "./nodes/ArithmeticNodes";
import { PowerNode, SqrtNode } from "./nodes/PowerNodes";
import { DerivativeNode, IntegralNode } from "./nodes/CalculusNodes";
import { PlotNode } from "./nodes/PlotNode";
import { MatrixNode } from "./nodes/MatrixNode";

export const nodeTypes: NodeTypes = {
  numberInput: NumberInputNode,
  variable: VariableNode,
  expression: ExpressionNode,
  add: AddNode,
  subtract: SubtractNode,
  multiply: MultiplyNode,
  divide: DivideNode,
  power: PowerNode,
  sqrt: SqrtNode,
  derivative: DerivativeNode,
  integral: IntegralNode,
  plot: PlotNode,
  matrix: MatrixNode,
};
