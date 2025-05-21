"use client";
import { BreadcrumbProvider } from '@/context/BreadcrumbContext'
import { UserProvider } from '@/hooks/useUser'
import React, { ReactNode } from 'react'

const Providers = ({ children }: {
    children: ReactNode
}) => {
    return (
        <UserProvider>
            <BreadcrumbProvider>
                {children}
            </BreadcrumbProvider>
        </UserProvider>
    )
}

export default Providers
