import { getMenus } from "./action";
import { MenuHeader } from "./components/Header";

const IndexPage = async () => {
  const menus = await getMenus();

  console.log(menus)

  return (
    <div className="flex flex-col w-full gap-10 overflow-hidden">
     <MenuHeader /> 
    </div>
  );
};

export default IndexPage;