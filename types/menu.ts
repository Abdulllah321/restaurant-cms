interface Category {
    id: string;
    name: string;
    menuId: string;
    menu: Menu; // Relationship with Menu
    items: MenuItem[]; // One-to-many relation with MenuItem
}

interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    category: Category; // Relationship with Category
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    Menu: Menu[]; // Many-to-many relationship with Menu
}

interface Menu {
    id: string;
    name: string;
    description?: string;
    categories: Category[]; // One-to-many relation with Category
    items: MenuItem[]; // One-to-many relation with MenuItem
    Branch: Branch[]; // Many-to-many relationship with Branch
    createdAt: Date;
    updatedAt: Date;
}
