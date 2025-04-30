import { User, Clipboard, Calendar, Box, Tag, Settings, CreditCard, Store, ChevronDown, ChevronUp, Menu } from "lucide-react"; // Importing Lucide icons

export const menuItems = [
    { name: "Users", icon: User, link: "/users" },
    {
        name: "Menu", icon: Menu, link: "/menus", hasSubmenu: true, subItems: [
            { name: "Menu", link: "/menus" },
            { name: "Menu Items", link: "/menus/items" },
            { name: "Menu Categories", link: "/menus/categories" },
        ]
    },
    {
        name: "Orders", icon: Clipboard, link: "/orders", hasSubmenu: true, subItems: [
            { name: "Pending Orders", link: "/orders/pending" },
            { name: "Completed Orders", link: "/orders/completed" },
        ]
    },
    { name: "Reservations", icon: Calendar, link: "/reservations" },
    { name: "Inventory", icon: Box, link: "/inventory" },
    {
        name: "Payments", icon: CreditCard, link: "/payments", hasSubmenu: true, subItems: [
            { name: "Payment History", link: "/payments/history" },
            { name: "Payment Methods", link: "/payments/methods" },
        ]
    },
    { name: "Promotions", icon: Tag, link: "/promotions" },
    { name: "Settings", icon: Settings, link: "/settings" },
    { name: "Store", icon: Store, link: "/store" }
];
