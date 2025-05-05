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
  