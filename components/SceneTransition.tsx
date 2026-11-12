'use client'

import { motion } from 'framer-motion'

/**
 * Every scene is mounted through this wrapper (see app/page.tsx). Instead
 * of an instant swap, AnimatePresence crossfades the outgoing scene into
 * a soft blur while the incoming one resolves into focus — like turning a
 * page rather than reloading one.
 */
export default function SceneTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.015 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.985 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
