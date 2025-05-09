// src/app/menus/create/page.tsx

import { Card } from "@/components/ui/card";
import {MenuForm} from "../../components/MenuForm";

type Params = Promise<{ action: string }>

export default async function CreateMenuPage({ params }: { params: Params }) {
  const { action } = await params;
  console.log(action)
  return (
    <Card className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create a New Menu</h1>
      <MenuForm action={action as string} />
    </Card>
  );
}
