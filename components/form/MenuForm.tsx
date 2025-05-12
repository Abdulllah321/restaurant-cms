"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createMenu } from "@/actions/menu.actions";
import { PlusCircle, Trash2 } from "lucide-react";

export type MenuInput = {
    name: string;
    description?: string;
    branchId: string;
    categories?: CategoryInput[];
};

export type CategoryInput = {
    name: string;
    items?: MenuItemInput[];
};

export type MenuItemInput = {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
};

interface MenuFormProps {
    selectedMenu?: MenuInput | null;
    branchId: string;
}

const MenuForm: React.FC<MenuFormProps> = ({ selectedMenu, branchId }) => {
    const action = selectedMenu ? createMenu : createMenu;
    const [state, formAction, pending] = useActionState(
        async (_: unknown, formData: FormData) => {
            formData.set("branchId", branchId); // inject branchId
            formData.set("categories", JSON.stringify(categories));
            return await action(_, formData);
        },
        null
    );

    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState<CategoryInput[]>([]);

    const getDefaultValue = (field: keyof MenuInput) => {
        return selectedMenu?.[field] ?? "";
    };

    const getErrorMessage = (field: keyof MenuInput) => {
        return state && "errors" in state
            ? (state.errors as Record<keyof MenuInput, string | undefined>)?.[field]
            : "";
    };

    const addCategory = () => {
        if (!categoryName.trim()) return;
        setCategories((prev) => [...prev, { name: categoryName, items: [] }]);
        setCategoryName("");
    };

    const removeCategory = (index: number) => {
        setCategories((prev) => prev.filter((_, i) => i !== index));
    };

    const updateItem = (catIndex: number, itemIndex: number, field: keyof MenuItemInput, value: any) => {
        const updated = [...categories];
        const item = updated[catIndex].items?.[itemIndex];
        if (item) {
            item[field] = field === "price" ? parseFloat(value) : value;
            setCategories(updated);
        }
    };

    const addItem = (catIndex: number) => {
        const updated = [...categories];
        updated[catIndex].items = updated[catIndex].items || [];
        updated[catIndex].items!.push({ name: "", description: "", price: 0 });
        setCategories(updated);
    };

    const removeItem = (catIndex: number, itemIndex: number) => {
        const updated = [...categories];
        updated[catIndex].items = updated[catIndex].items?.filter((_, i) => i !== itemIndex);
        setCategories(updated);
    };

    return (
        <form action={formAction} className="space-y-6">
            {/* Menu Name */}
            <div>
                <Label>Name</Label>
                <Input name="name" defaultValue={getDefaultValue("name") as string} />
                {getErrorMessage("name") && <p className="text-destructive">{getErrorMessage("name")}</p>}
            </div>

            {/* Description */}
            <div>
                <Label>Description</Label>
                <Textarea name="description" defaultValue={getDefaultValue("description") as string} />
            </div>

            {/* Add Category */}
            <div className="*:not-first:mt-2">
                <Label htmlFor="categories">Add Category</Label>
                <div className="relative">
                    <Input
                        id="categories"
                        className="peer ps-3 pe-9"
                        placeholder="Category name..."
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={addCategory}
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground"
                        aria-label="Add Category"
                    >
                        <PlusCircle size={16} />
                    </button>
                </div>
            </div>

            {/* Category List with Items */}
            {categories.map((category, catIndex) => (
                <div key={catIndex} className="border rounded-md p-4 space-y-4 bg-muted/20">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{category.name}</h3>
                        <button
                            type="button"
                            onClick={() => removeCategory(catIndex)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Menu Items for this category */}
                    {category.items?.map((item, itemIndex) => (
                        <div key={itemIndex} className="space-y-2 border p-3 rounded-md bg-background">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Item {itemIndex + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => removeItem(catIndex, itemIndex)}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <Input
                                placeholder="Item name"
                                value={item.name}
                                onChange={(e) => updateItem(catIndex, itemIndex, "name", e.target.value)}
                            />
                            <Textarea
                                placeholder="Item description"
                                value={item.description}
                                onChange={(e) => updateItem(catIndex, itemIndex, "description", e.target.value)}
                            />
                            <Input
                                placeholder="Price"
                                type="number"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => updateItem(catIndex, itemIndex, "price", e.target.value)}
                            />
                        </div>
                    ))}

                    <Button type="button" size="sm" onClick={() => addItem(catIndex)}>
                        <PlusCircle size={16} className="mr-1" /> Add Item
                    </Button>
                </div>
            ))}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={pending}>
                {pending
                    ? selectedMenu
                        ? "Updating..."
                        : "Creating..."
                    : selectedMenu
                        ? "Update Menu"
                        : "Create Menu"}
            </Button>
        </form>
    );
};

export default MenuForm;
