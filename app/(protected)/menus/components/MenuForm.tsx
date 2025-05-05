import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { useMenus } from "@/hooks/useMenu"
import { useEffect } from "react"

interface MenuFormData {
    name: string
    description?: string
}

export function MenuForm() {
    const {
        showModal,
        handleHideModal,
        currentMenu,
        create,
        update,
    } = useMenus()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<MenuFormData>({
        defaultValues: {
            name: "",
            description: ""
        }
    })

    // Reset form when menu changes (edit/create)
    useEffect(() => {
        if (currentMenu) {
            reset({
                name: currentMenu.name,
                description: currentMenu.description ?? ""
            })
        } else {
            reset({ name: "", description: "" })
        }
    }, [currentMenu, reset])

    const onSubmit = async (data: MenuFormData) => {
        try {
            if (currentMenu) {
                await update(currentMenu.id, data)
            } else {
                await create(data)
            }
            handleHideModal()
        } catch (e) {
            console.error("Form submission error", e)
        }
    }

    return (
        <Sheet open={showModal} onOpenChange={handleHideModal} modal>
            <SheetContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <SheetHeader>
                        <SheetTitle>{currentMenu ? "Edit Menu" : "Create Menu"}</SheetTitle>
                        <SheetDescription>
                            {currentMenu ? "Update menu details." : "Add a new menu entry."}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            className="col-span-3"
                        />
                        {errors.name && <span className="text-sm text-red-500 col-span-4">{errors.name.message}</span>}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            {...register("description")}
                            className="col-span-3"
                        />
                    </div>

                    <SheetFooter className="pt-4">
                        <Button type="submit">
                            {currentMenu ? "Save Changes" : "Create Menu"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
