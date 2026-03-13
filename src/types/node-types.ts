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
import {
  TimeNode,
  Vector2Node,
  Vector3Node,
  DotProductNode,
  CrossProductNode,
  NormalizeNode,
  LengthNode,
  MatrixMultiplyNode,
  DeterminantNode,
  InverseNode,
  VelocityNode,
  AccelerationNode,
  ForceNode,
  KineticEnergyNode,
  PotentialEnergyNode,
  OscillatorNode,
  RandomNode,
} from "../features/flow/nodes/AdvancedMathNodes"

export const nodeTypes: NodeTypes = {
  numberInput: NumberInputNode,
  constant: ConstantNode,
  time: TimeNode,
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
  vector2: Vector2Node,
  vector3: Vector3Node,
  dotProduct: DotProductNode,
  crossProduct: CrossProductNode,
  normalize: NormalizeNode,
  length: LengthNode,
  plot: PlotNode,
  matrix: MatrixNode,
  matrixMultiply: MatrixMultiplyNode,
  determinant: DeterminantNode,
  inverse: InverseNode,
  velocity: VelocityNode,
  acceleration: AccelerationNode,
  force: ForceNode,
  kineticEnergy: KineticEnergyNode,
  potentialEnergy: PotentialEnergyNode,
  oscillator: OscillatorNode,
  random: RandomNode,
  group: GroupNode,
}
