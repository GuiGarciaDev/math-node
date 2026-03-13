import { LuPi } from "react-icons/lu"
import type { SidebarCategory } from "../../types"
import {
  TbMathIntegral,
  TbMathSin,
  TbMathXDivideY,
  TbMatrix,
  TbNumber123,
  TbSquareRoot2,
  TbXPowerY,
} from "react-icons/tb"
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa"
import { PiSigmaThin } from "react-icons/pi"
import { BsStars } from "react-icons/bs"

export const categories: SidebarCategory[] = [
  {
    name: "Inputs",
    color: "input",
    items: [
      {
        type: "numberInput",
        label: "Number",
        icon: TbNumber123,
        iconColor: "input",
      },
      {
        type: "constant",
        label: "Constant",
        icon: LuPi,
        iconColor: "input",
        description: "pi, e",
      },
      {
        type: "time",
        label: "Time",
        icon: TbNumber123,
        iconColor: "input",
      },
    ],
  },
  {
    name: "Arithmetic",
    color: "arithmetic",
    items: [
      {
        type: "add",
        label: "Add",
        icon: FaPlus,
        iconColor: "arithmetic",
      },
      {
        type: "subtract",
        label: "Subtract",
        icon: FaMinus,
        iconColor: "arithmetic",
      },
      {
        type: "multiply",
        label: "Multiply",
        icon: FaTimes,
        iconColor: "arithmetic",
      },
      {
        type: "divide",
        label: "Divide",
        icon: TbMathXDivideY,
        iconColor: "arithmetic",
      },
      {
        type: "power",
        label: "Power",
        icon: TbXPowerY,
        iconColor: "arithmetic",
      },
      {
        type: "root",
        label: "Root",
        icon: TbSquareRoot2,
        iconColor: "arithmetic",
      },
    ],
  },
  {
    name: "Trigonometry",
    color: "trigonometry",
    items: [
      {
        type: "trigonometric",
        label: "Sin",
        icon: TbMathSin,
        iconColor: "trigonometry",
        presetParams: { operation: "sin" },
      },
      {
        type: "trigonometric",
        label: "Cos",
        icon: TbMathSin,
        iconColor: "trigonometry",
        presetParams: { operation: "cos" },
      },
      {
        type: "trigonometric",
        label: "Tan",
        icon: TbMathSin,
        iconColor: "trigonometry",
        presetParams: { operation: "tan" },
      },
      {
        type: "trigonometric",
        label: "Asin",
        icon: TbMathSin,
        iconColor: "trigonometry",
        presetParams: { operation: "asin" },
      },
      {
        type: "trigonometric",
        label: "Acos",
        icon: TbMathSin,
        iconColor: "trigonometry",
        presetParams: { operation: "acos" },
      },
      {
        type: "trigonometric",
        label: "Atan",
        icon: TbMathSin,
        iconColor: "trigonometry",
        presetParams: { operation: "atan" },
      },
    ],
  },
  {
    name: "Calculus",
    color: "calculus",
    items: [
      {
        type: "derivative",
        label: "Derivative",
        icon: PiSigmaThin,
        iconColor: "calculus",
      },
      {
        type: "integral",
        label: "Integral",
        icon: TbMathIntegral,
        iconColor: "calculus",
      },
    ],
  },
  {
    name: "Vectors",
    color: "vectors",
    items: [
      {
        type: "vector2",
        label: "Vector2",
        icon: TbNumber123,
        iconColor: "vectors",
      },
      {
        type: "vector3",
        label: "Vector3",
        icon: TbNumber123,
        iconColor: "vectors",
      },
      {
        type: "dotProduct",
        label: "Dot Product",
        icon: FaTimes,
        iconColor: "vectors",
      },
      {
        type: "crossProduct",
        label: "Cross Product",
        icon: FaTimes,
        iconColor: "vectors",
      },
      {
        type: "normalize",
        label: "Normalize",
        icon: TbMathXDivideY,
        iconColor: "vectors",
      },
      {
        type: "length",
        label: "Length",
        icon: TbSquareRoot2,
        iconColor: "vectors",
      },
    ],
  },
  {
    name: "Matrices",
    color: "matrices",
    items: [
      {
        type: "matrix",
        label: "Matrix",
        icon: TbMatrix,
        iconColor: "matrices",
      },
      {
        type: "matrixMultiply",
        label: "Matrix Multiply",
        icon: TbMatrix,
        iconColor: "matrices",
      },
      {
        type: "determinant",
        label: "Determinant",
        icon: TbMatrix,
        iconColor: "matrices",
      },
      {
        type: "inverse",
        label: "Inverse",
        icon: TbMatrix,
        iconColor: "matrices",
      },
    ],
  },
  {
    name: "Physics",
    color: "physics",
    items: [
      {
        type: "velocity",
        label: "Velocity",
        icon: TbNumber123,
        iconColor: "physics",
      },
      {
        type: "acceleration",
        label: "Acceleration",
        icon: TbNumber123,
        iconColor: "physics",
      },
      {
        type: "force",
        label: "Force",
        icon: FaTimes,
        iconColor: "physics",
      },
      {
        type: "kineticEnergy",
        label: "Kinetic Energy",
        icon: TbMathIntegral,
        iconColor: "physics",
      },
      {
        type: "potentialEnergy",
        label: "Potential Energy",
        icon: TbMathIntegral,
        iconColor: "physics",
      },
    ],
  },
  {
    name: "Signals",
    color: "signals",
    items: [
      {
        type: "oscillator",
        label: "Oscillator",
        icon: TbMathSin,
        iconColor: "signals",
      },
      {
        type: "random",
        label: "Random",
        icon: BsStars,
        iconColor: "signals",
      },
    ],
  },
]
