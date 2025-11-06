"use client";

import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center gradient-bg">
      <div className="text-center space-y-6">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-16 h-16 mx-auto"
        >
          <div className="w-full h-full rounded-full border-4 border-pink-500/30 border-t-pink-500"></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm"
        >
          Loading your song...
        </motion.p>
      </div>
    </div>
  );
}
