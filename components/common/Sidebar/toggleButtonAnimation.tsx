import { motion } from "framer-motion";
import { useState } from "react";

// Define path transitions
const topVariants = {
    open: { d: "M6 6L18 18" }, // top diagonal of X
    closed: { d: "M4 6H20" },  // top bar of menu
};

const middleVariants = {
    open: { rotate: 45, opacity: 0 },
    closed: { rotate: 0 , opacity: 1},
};

const bottomVariants = {
    open: { d: "M6 18L18 6" }, // bottom diagonal of X
    closed: { d: "M4 18H20" }, // bottom bar of menu
};

const Transition = { duration: 0.3, ease: "easeInOut" };
export { topVariants, bottomVariants, middleVariants, Transition }