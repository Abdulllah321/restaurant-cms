"use client";
import { ReactNode, useState } from "react";
import { CircleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CustomDeleteDialogProps {
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  trigger?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (bool: boolean) => void;
  colorScheme?: string;
}

export default function CustomDeleteDialog({
  title = "Are you sure?",
  description = "This action cannot be undone. Please confirm that you want to proceed.",
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon = <CircleAlertIcon className="opacity-80" size={20} />,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  trigger,
  colorScheme = "bg-destructive/10 text-destructive",
}: CustomDeleteDialogProps) {
  // Uncontrolled state (if no isOpen and setIsOpen are provided)
  const [isOpen, setIsOpen] = useState(false);

  // Use controlled state if provided, otherwise fallback to local state
  const dialogIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;
  const setDialogIsOpen =
    controlledSetIsOpen !== undefined ? controlledSetIsOpen : setIsOpen;

  const handleConfirm = () => {
    onConfirm();
    setDialogIsOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setDialogIsOpen(false);
  };

  const handleOpen = () => setDialogIsOpen(true);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setDialogIsOpen(false);
    }
  };

  return (
    <>
      {/* Optional Trigger */}
      {trigger && (
        <div className="relative inline-block">
          {trigger}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={handleOpen}
          />
        </div>
      )}

      {/* Dialog */}
      <AnimatePresence>
        {dialogIsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
          >
            <Card
              onClick={(e) => e.stopPropagation()}
              style={{ width: "calc(100% - 20px)" }}
              className="text-center max-w-sm"
            >
              <CardHeader>
                <div
                  className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full mx-auto",
                    colorScheme
                  )}
                >
                  {icon}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardContent>
              <CardFooter className="space-x-4 justify-center flex w-full">
                <Button variant="outline" onClick={handleCancel}>
                  {cancelLabel}
                </Button>
                <Button variant="destructive" onClick={handleConfirm}>
                  {confirmLabel}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
