// Menu Type
interface Menu {
  id: string;
  name: string;
  description?: string | null;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
  categories: Category[];
  items: MenuItem[];
  MenuCategory: MenuCategory[];
}

// interface
interface Category {
  id: string;
  name: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
  menus: Menu[];
  items: MenuItem[];
  MenuCategory: MenuCategory[];
}

interface MenuCategory {
  id: string;
  menuId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  menu: Menu;
  category: Category;
}

// interface
interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  categoryId: string;
  menuId: string;
  branchId: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  menu: Menu;
  OrderItem: OrderItem[];
}

interface Branch {
  id: string;
  name: string;
  location: string;
  phoneNumber: string;
  // staff: Staff[]; // One-to-many relationship with Staff
  menu: Menu[]; // Many-to-many relationship with Menu
  // inventory: Inventory[]; // One-to-many relationship with Inventory
  // reservations: Reservation[]; // One-to-many relationship with Reservations
  createdAt: Date;
  updatedAt: Date;
}
