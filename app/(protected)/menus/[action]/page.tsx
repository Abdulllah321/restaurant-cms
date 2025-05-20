import { getMenuById } from "@/actions/menu.actions";
import MenusForm from "@/components/form/MenusFormPage";
import Categories from "@/components/menu/categories";
import MenuItems from "@/components/menu/items";
import React from "react";

interface ActionPageProps {
  params: Promise<{ action: string }>;
  searchParams: Promise<{ query: string }>;
}

const ActionPage = async ({ params, searchParams }: ActionPageProps) => {
  const { action } = await params;
  const { query } = await searchParams;

  let selectedMenu: Menu | null = null;
  if (action !== "create" && action !== "categories" && action !== "items") {
    const res = await getMenuById(action);
    selectedMenu = res.menu as unknown as Menu;
  }
  {
    switch (action) {
      case "categories":
        return <Categories search={query} />;
      case "items":
        return <MenuItems query={query} />;
      default:
        return <MenusForm selectedMenu={selectedMenu} />;
    }
  }
};

export default ActionPage;
