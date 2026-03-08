import { LuPi } from "react-icons/lu"
import type { SidebarCategory } from "../../types"
import {
  TbMathEqualGreater,
  TbMathFunction,
  TbMathIntegral,
  TbMathSin,
  TbMathXDivideY,
  TbMatrix,
  TbNumber123,
  TbSquareRoot2,
  TbVariable,
  TbXPowerY,
} from "react-icons/tb"
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa"
import { SiSagemath } from "react-icons/si"
import { PiSigmaThin } from "react-icons/pi"
import { BsGraphDown } from "react-icons/bs"

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
        type: "variable",
        label: "Variable",
        icon: TbVariable,
        iconColor: "input",
      },
      {
        type: "expression",
        label: "Expression",
        icon: TbMathFunction,
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
        label: "Trigonometric Function",
        icon: TbMathSin,
        iconColor: "trigonometry",
        description: "sin, cos, tan, etc.",
      },
    ],
  },
  {
    name: "Logarithmic",
    color: "logarithmic",
    items: [
      {
        type: "ln",
        label: "ln",
        icon: SiSagemath,
        iconColor: "logarithmic",
      },
      {
        type: "log",
        label: "log",
        icon: SiSagemath,
        iconColor: "logarithmic",
      },
    ],
  },
  {
    name: "Logic",
    color: "logic",
    items: [
      {
        type: "comparator",
        label: "Comparator",
        icon: TbMathEqualGreater,
        iconColor: "logic",
        description: "< > <= >= ===",
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
    name: "Display",
    color: "display",
    items: [
      {
        type: "plot",
        label: "Plot Function",
        icon: BsGraphDown,
        iconColor: "display",
      },
      {
        type: "matrix",
        label: "Matrix",
        icon: TbMatrix,
        iconColor: "display",
      },
    ],
  },
]
