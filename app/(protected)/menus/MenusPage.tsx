import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiAddCircleFill } from "@remixicon/react";
import PageHeader from "@/components/common/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MenuActions from "@/components/menu/MenuActions";


type Props = {
  menus: Menu[];
};

const MenusPage = ({ menus }: Props) => {

  console.log(menus)
  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-12">
        <PageHeader
          title="Menus"
          actionTrigger={
            <Link href="/menus/create">
              <Button
                className="shadow-sm flex items-center gap-2"
                variant="default"
              >
                <RiAddCircleFill size={20} />
                Add New Menu
              </Button>
            </Link>
          }
        />


        {menus.length === 0 && (
          <p className="mt-6 text-center text-muted-foreground text-lg">
            No menus found.
          </p>
        )}

        <div className="space-y-12 mt-8">
          {menus.map((menu) => {
            const itemsByCategory: Record<string, MenuItem[]> = menu.items.reduce((acc, item) => {
              if (!acc[item.categoryId]) {
                acc[item.categoryId] = [];
              }
              acc[item.categoryId].push(item);
              return acc;
            }, {} as Record<string, MenuItem[]>);
            return (
              <Card
                key={menu.id}
                className="rounded-lg shadow-md border border-border p-6  max-w-2xl mx-auto relative"

              >
                <CardHeader className="mb-6 ">
                  <h2 className="text-3xl font-extrabold text-foreground">
                    {menu.name}
                  </h2>
                  {menu.description && (
                    <p className="mt-2 text-muted-foreground max-w-2xl">
                      {menu.description}
                    </p>
                  )}
                </CardHeader>
                <MenuActions menu={menu} />

                <CardContent className="space-y-6">
                  {menu.categories.map((category) => {
                    const items = itemsByCategory[category.id] || [];

                    return (
                      <div
                        key={category.id}
                        className="transition-shadow duration-300"
                      >
                        <div className="flex items-center mb-4 space-x-4">
                          <Avatar className="border-primary p-px w-16 h-16">
                            <AvatarImage
                              src={
                                category.imageUrl ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  category.name
                                )}&background=random&size=128`
                              }
                              alt={category.name}
                            />
                            <AvatarFallback>
                              {category.name
                                .split(" ")
                                .filter(
                                  (word) =>
                                    !["and", "of", "the", "in", "on"].includes(
                                      word.toLowerCase()
                                    )
                                )
                                .slice(0, 2)
                                .map((word) => word[0].toUpperCase())
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="text-xl font-semibold text-foreground border-b border-border pb-1 flex-1">
                            {category.name}
                          </h3>
                        </div>

                        <ul className="divide-y divide-border">
                          {items.length === 0 && (
                            <li className="italic text-muted-foreground pl-4">
                              No items in this category.
                            </li>
                          )}
                          {items.map((item) => (
                            <li
                              key={item.id}
                              className="py-3 flex items-center justify-between hover:bg-card/60 rounded transition-colors duration-200 px-3"
                            >
                              <div>
                                <p className="font-semibold text-foreground">
                                  {item.name}
                                </p>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <span className="font-semibold text-primary whitespace-nowrap">
                                {item.price.toFixed(2)} PKR
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default MenusPage;
