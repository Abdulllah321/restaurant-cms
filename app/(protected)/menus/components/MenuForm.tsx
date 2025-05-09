'use client';

import { useActionState } from 'react';
import { createMenu } from '../action';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CustomMultiSelect from '@/components/CustomMultiSelect';



export function MenuForm({ action }: { action: string }) {
    const [state, formAction, pending] = useActionState(createMenu, null);
    const errors = state?.errors;

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <Label htmlFor="name" >Menu Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"

                />
                {errors && errors.name && errors.name.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                )}
            </div>

            <div>
                <Label htmlFor="description" >Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={3}
                />
                {errors && errors.description && errors.description.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
                )}
            </div>

            <div>
                <Label htmlFor='items'></Label>
                <CustomMultiSelect label={"Menu Items"} />
            </div>

            <div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={pending}
                >
                    {pending ? 'Creating...' : 'Create Menu'}
                </Button>
            </div>
        </form>
    );
}
