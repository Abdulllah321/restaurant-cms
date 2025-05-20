// src/components/Categories.tsx
import { getCategories } from "@/actions/categories.actions";
import { getSelectedBranchFromCookiesFromServer } from "@/data/serverConstants";
import { Card, CardContent } from "../../ui/card";
import { CategoryHeader } from "./CategoryHeader";
import { CategoryCard } from "./CategoryCard";
import { CategoryFooter } from "./CardFooter";
import { EmptyState } from "@/components/common/EmptyState";
import CategoryFormModal from "./CategoryFormModel";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const Categories = async ({ search }: { search?: string }) => {
  const selectedBranch = await getSelectedBranchFromCookiesFromServer();
  if (!selectedBranch) {
    throw new Error("Branch ID is required!");
  }

  const branchId = selectedBranch.id;
  const categories = (await getCategories(branchId, search))
    .categories as Category[];

  const hasSearchTerm = search && search.trim().length > 0;
  const title = hasSearchTerm
    ? "No Matching Categories"
    : "No Categories Found";
  const description = hasSearchTerm
    ? "No categories match your search criteria. Try adjusting your search or adding a new category."
    : "It looks like there are no categories added yet. Create a new category to organize your items and make management easier.";

  return (
    <Card>
      <CategoryHeader />
      <CardContent>
        {categories && categories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
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
                <CategoryFormModal
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
      </CardContent>
      <CategoryFooter categories={categories} />
    </Card>
  );
};

export default Categories;
