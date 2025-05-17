import MenuForm from '@/components/form/MenuForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import React from 'react'

const MenusForm = () => {
 

    return (
        <Card className="max-w-2xl w-full mx-auto mt-10 rounded-2xl">
            <CardHeader>
                <CardTitle>
                    <h2 className="text-xl font-semibold text-primary">Create New Menu</h2>
                </CardTitle>
                <CardDescription>
                    Fill out the details below to create a new menu, including its categories and items.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MenuForm />
            </CardContent>
        </Card>

    )
}

export default MenusForm
