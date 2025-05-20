// Menu Type
interface Menu {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  categories: Category[];
  items: MenuItem[];
  branch: Branch[];
}

// interface
interface Category {
  id: string;
  name: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
  menus: Menu[];
  imageUrl: string?;
  items: MenuItem[];
  _count?: {
    items: number;
  };
}

// interface
interface MenuItem {
  id?: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  imageUrl?: string | null;
  blurDataUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  category: Category;
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
