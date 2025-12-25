"use client";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

export default function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  const baseStyles = "px-8 py-3 rounded-full font-heading font-semibold transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-taiga-accent text-taiga-dark hover:bg-white hover:shadow-[0_0_20px_rgba(212,242,56,0.5)]",
    outline: "border border-taiga-light text-taiga-light hover:bg-taiga-accent hover:text-taiga-dark hover:border-taiga-accent",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

