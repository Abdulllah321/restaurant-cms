import { motion } from "framer-motion";

const AnimatedCheckmark = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-check"
    >
      <motion.path
        d="M4 12l5 5L20 6" // Path flipped for left-to-right drawing
        strokeDasharray="24"
        strokeDashoffset="24"
        initial={{ strokeDashoffset: 24, opacity: 0 }}
        animate={{ strokeDashoffset: 0, opacity: 1 }}
        exit={{ strokeDashoffset: 24, opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
};

export default AnimatedCheckmark;