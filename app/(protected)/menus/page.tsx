
"use client"
import { useMenus } from "../../../hooks/useMenu";
import { MenuHeader } from "./components/Header";
import { MenuForm } from "./components/MenuForm";

const IndexPage = () => {
  const { menus, showModal } = useMenus();
  console.log(menus)
  return (
    <div className="flex flex-col w-full gap-10 overflow-hidden">
      <MenuHeader />
      <MenuForm />
      {/* <DataTable data={projects} columns={columns} /> */}
    </div>
  );
};

export default IndexPage;