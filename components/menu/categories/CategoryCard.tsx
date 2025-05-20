import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import CategoryActions from "./CategoryActions";

export const CategoryCard = ({ category }: { category: Category }) => {

  return (
    <>
      <div
        className="relative p-4 flex flex-col justify-between border bg-gradient-to-t hover:from-primary/10 to-transparent border from-transparent transition-all cursor-pointer space-y-2"
        key={category.id}
      >
        <div className="absolute w-full h-15 bg-gradient-to-b from-primary/80 to-transparent top-0 left-0 rounded-b-md" />
        <div className="space-y-3">
          {/* Category Header */}
          <div className="flex gap-2 items-center z-10 relative mx-auto justify-center">
            <Avatar className="border-primary p-px">
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
            <h2 className="text-xl font-bold">{category.name}</h2>
          </div>

          {/* Menus Section */}
          {category.menus && category.menus.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Menus:</h3>
              <ul className="list-disc ps-5">
                {category.menus.map((menu) => (
                  <li key={menu.id} className="text-sm">
                    {menu.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Items Section */}
          {category._count!.items > 0 && (
            <>
              <hr />
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <Badge key={item.id}>{item.name}</Badge>
                ))}
              </div>
              <hr />
            </>
          )}

          {/* Date Information */}
          <div className="text-sm text-muted-foreground mt-4">
            <p>
              Created:{" "}
              {format(new Date(category.createdAt), "MMMM dd, yyyy h:mm a")}
            </p>
            {category.updatedAt && (
              <p>
                Last Updated{" "}
                {formatDistanceToNow(new Date(category.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            )}
          </div>
        </div>

        {/* Items Footer */}
        <CategoryActions category={category} />
      </div>
    </>
  );
};
