import MenusPage from "./MenusPage"; // The component above
import { getMenus } from "@/actions/menu.actions";

const Page = async () => {
  const menus = await getMenus() as unknown as Menu[];

  return <MenusPage menus={menus} />;
};

export default Page;
