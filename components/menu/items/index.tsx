import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getMenuItems } from "@/actions/menu.actions";
import ItemsActions from "./ItemsActions";
import { MenuItemHeader } from "./ItemsHeader";
import { EmptyState } from "@/components/common/EmptyState";
import MenuItemFormModal from "./MenuItemFormModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function MenuItems({ query }: { query: string }) {
  const menuItems = (await getMenuItems(query)) as MenuItem[];
  const hasSearchTerm = query && query.trim().length > 0;

  const title = hasSearchTerm
    ? "No Matching Menu Items"
    : "No Menu Items Found";

  const description = hasSearchTerm
    ? "No menu items match your search criteria. Try adjusting your search or adding a new menu item."
    : "It looks like there are no menu items added yet. Create a new menu item to start building your menu.";

  return (
    <>
      <MenuItemHeader />
      {menuItems.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden pt-0 pb-4 flex flex-col justify-between"
            >
              <CardHeader className="relative p-0">
                <div className="relative w-full h-60 bg-[#F7EFE9]">
                  <Image
                    src={item.imageUrl || "/images/no-image.jpeg"}
                    alt={item.name}
                    fill
                    className="object-contain"
                    placeholder={item.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={item.blurDataUrl || undefined}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle>{item.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <Badge>{item.category.name}</Badge>
                <p className="text-lg font-semibold">
                  Rs. {item.price.toFixed(2)}
                </p>
              </CardContent>
              <ItemsActions item={item} />
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          illustration={
            <Image
              src={"/images/empty.svg"}
              alt="No Categories Found"
              width={300}
              height={250}
            />
          }
          title={title}
          description={description}
          trigger={
            !hasSearchTerm && (
              <MenuItemFormModal
                trigger={
                  <Button>
                    <PlusCircle className="mr-2" />
                    Add Category
                  </Button>
                }
              />
            )
          }
        />
      )}
    </>
  );
}
