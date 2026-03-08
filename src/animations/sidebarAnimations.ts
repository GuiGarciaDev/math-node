import type { Variants } from "framer-motion"

const smoothEase: [number, number, number, number] = [0.4, 0, 0.2, 1]

export const sidebarCategoryVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

export const sidebarItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -12,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: {
      duration: 0.14,
      ease: "easeIn",
    },
  },
}

export const containerVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: smoothEase,
      when: "afterChildren",
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.22,
      ease: smoothEase,
      when: "beforeChildren",
    },
  },
}

export const chevronVariants: Variants = {
  collapsed: ({ itemCount }: { itemCount: number }) => ({
    rotate: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      delay: 0.14 + Math.max(itemCount - 1, 0) * 0.03,
    },
  }),
  expanded: {
    rotate: 90,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
}
