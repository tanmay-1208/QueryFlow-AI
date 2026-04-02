import { motion } from "framer-motion";

export const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.08 } }
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
    }}
  >
    {children}
  </motion.div>
);