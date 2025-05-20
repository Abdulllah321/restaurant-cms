import { CardFooter } from "@/components/ui/card";

export const CategoryFooter = ({ categories }: { categories: Category[] }) => {
  return (
    <CardFooter className="flex justify-between items-center py-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Total Categories: {categories?.length || 0}
        </p>
      </div>
    </CardFooter>
  );
};
