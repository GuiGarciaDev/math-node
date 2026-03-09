import type { Variants } from "framer-motion"
import { smoothEase } from "./sidebarAnimations"

export const dropdownContentVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: -4,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.16,
      ease: smoothEase,
      when: "beforeChildren",
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: {
      duration: 0.1,
      ease: "easeIn",
      when: "afterChildren",
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
}

export const dropdownItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -8,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.16,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: {
      duration: 0.08,
      ease: "easeIn",
    },
  },
}
