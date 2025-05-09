// components/CustomSheet.tsx
import { motion, AnimatePresence } from "motion/react"
import { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CustomSheetProps {
    open: boolean
    onClose: () => void
    title: string
    description?: string
    children: ReactNode
}

export const CustomSheet = ({ open, onClose, title, description, children }: CustomSheetProps) => {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 p-6 flex flex-col"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-lg font-semibold">{title}</h2>
                                {description && <p className="text-sm text-gray-500">{description}</p>}
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
