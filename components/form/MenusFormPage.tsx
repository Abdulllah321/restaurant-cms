import MenuForm from "@/components/form/MenuForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import React from "react";

const MenusFormPage = ({ selectedMenu }: { selectedMenu: Menu | null }) => {
  const isEditing = !!selectedMenu;

  return (
    <Card className="max-w-2xl w-full mx-auto mt-10 rounded-2xl">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-semibold text-primary">
            {isEditing ? "Edit Menu" : "Create New Menu"}
          </h2>
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the details of your menu, including its categories and items."
            : "Fill out the details below to create a new menu, including its categories and items."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MenuForm selectedMenu={selectedMenu} />
      </CardContent>
    </Card>
  );
};

export default MenusFormPage;
