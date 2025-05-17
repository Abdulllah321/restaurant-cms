import MenuForm from "@/components/form/MenuForm";
import MenusForm from "@/components/form/MenusForm";
import React from "react";

interface ActionPageProps {
  params: { action: string };
}

const ActionPage = async ({ params }: ActionPageProps) => {
  const { action } = params;
  return <>
  {action && action}
  <MenusForm/>
  </>;
};

export default ActionPage;
