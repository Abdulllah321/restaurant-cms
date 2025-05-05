"use client";
import { useState, useEffect } from 'react';
import { createMenu, getMenus, updateMenu, deleteMenu } from '../app/(protected)/menus/action';

interface UseMenusHook {
    menus: Menu[];
    loading: boolean;
    error: string | null;
    create: (data: { name: string; description?: string }) => Promise<void>;
    update: (id: string, data: { name?: string; description?: string }) => Promise<void>;
    remove: (id: string) => Promise<void>;
    showModal: boolean;
    handleShowModal: (action: 'create' | 'update' | 'delete', menu?: Menu) => void;
    handleHideModal: () => void;
    currentMenu: Menu | null;
}

export function useMenus(): UseMenusHook {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);  // To control modal visibility
    const [currentMenu, setCurrentMenu] = useState<Menu | null>(null); // To store current menu data for editing

    // Generic handler for all API requests
    const handleApiRequest = async (
        action: 'create' | 'update' | 'delete',
        data?: any,
        id?: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            let result: Menu;
            if (action === 'create') result = await createMenu(data) as Menu;
            if (action === 'update') result = await updateMenu(id!, data) as Menu;
            if (action === 'delete') result = await deleteMenu(id!) as Menu;

            setMenus((prevMenus) => {
                if (action === 'create') return [...prevMenus, result];
                if (action === 'update')
                    return prevMenus.map((menu) => (menu.id === id ? result : menu));
                if (action === 'delete')
                    return prevMenus.filter((menu) => menu.id !== id);
                return prevMenus;
            });
        } catch (err) {
            setError(`Failed to ${action} menu`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch menus initially
    useEffect(() => {
        const fetchMenus = async () => {
            setLoading(true);
            try {
                const fetchedMenus = await getMenus();
                setMenus(fetchedMenus as Menu[]);
            } catch (err) {
                setError('Failed to load menus');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    // Handle showing modal for create, update, or delete
    const handleShowModal = (action: 'create' | 'update' | 'delete', menu?: Menu) => {
        setShowModal(!showModal);
        setCurrentMenu(menu || null); // If it's an update or delete, pass the menu to be edited
    };


    // To hide modal
    const handleHideModal = () => {
        setShowModal(false);
        setCurrentMenu(null);
    };

    return {
        menus,
        loading,
        error,
        create: (data: { name: string; description?: string }) =>
            handleApiRequest('create', data),
        update: (id: string, data: { name?: string; description?: string }) =>
            handleApiRequest('update', data, id),
        remove: (id: string) => handleApiRequest('delete', undefined, id),
        showModal,
        handleShowModal,
        currentMenu,
        handleHideModal
    };
}
