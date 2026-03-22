import React, { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useUIStore } from "@/features/flow/store/ui-store"

const IntroductionModal: React.FC = () => {
  const isIntroModalOpen = useUIStore((s) => s.isIntroModalOpen)
  const dismissIntroModal = useUIStore((s) => s.dismissIntroModal)

  useEffect(() => {
    if (!isIntroModalOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissIntroModal()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dismissIntroModal, isIntroModalOpen])

  return (
    <AnimatePresence>
      {isIntroModalOpen ? (
        <motion.div
          onClick={dismissIntroModal}
          className="fixed inset-0 z-140 flex items-center justify-center bg-black p-4"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <motion.section
            onClick={(event) => event.stopPropagation()}
            className="w-[min(680px,96vw)] rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="intro-modal-title"
            aria-describedby="intro-modal-description"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Welcome to Math Node
            </div>

            <h2 id="intro-modal-title" className="mb-2 text-xl font-semibold">
              This project is still in progress
            </h2>

            <p
              id="intro-modal-description"
              className="mb-5 text-sm leading-relaxed text-muted-foreground"
            >
              You are viewing an early build. Core workflows are available and
              stable, while some areas are still under active development.
            </p>

            <div className="mb-6 rounded-xl border border-border bg-background p-4">
              <div className="mb-2 text-sm font-semibold">
                Currently supported
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>- Visual node editor with draggable graph canvas</li>
                <li>- Workflow save/load with persistent storage</li>
                <li>- Math evaluation pipeline and expression nodes</li>
                <li>- Undo/redo and interaction shortcuts</li>
                <li>- Project listing and workflow navigation</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={dismissIntroModal}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors duration-200 hover:bg-accent"
              >
                Start exploring
              </button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default IntroductionModal
