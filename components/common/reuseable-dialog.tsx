import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ReusableDialogProps {
  title: string;
  subTitle?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trigger?: ReactNode;
  children: ReactNode;
}

export function ReusableDialog({
  title,
  subTitle,
  isOpen,
  setIsOpen,
  trigger,
  children,
}: ReusableDialogProps) {
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      {trigger && <span onClick={() => setIsOpen(true)}>{trigger}</span>}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDialog}  
          >
            <motion.div
              className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing on content click
            >
              <button
                onClick={closeDialog}
                className="absolute top-3 right-3 p-1 rounded-full bg-foreground/20 cursor-pointer"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </button>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-primary">{title}</h2>
                {subTitle && <p className="text-sm text-muted-foreground">{subTitle}</p>}
              </div>
              <div className="flex flex-col gap-4">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
