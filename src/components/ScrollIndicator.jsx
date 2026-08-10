import { motion, useScroll, useSpring } from "motion/react";

const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-r-full"
        style={{
          scaleX,
          transformOrigin: "0%",
          boxShadow: "0 0 10px rgba(56, 189, 248, 0.6), 0 0 20px rgba(168, 85, 247, 0.4)",
        }}
      />
    </div>
  );
};

export default ScrollIndicator;
