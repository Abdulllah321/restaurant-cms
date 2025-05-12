import Header from '@/components/common/Header'
import { Button } from '@/components/ui/button'
import { RiAddCircleFill, RiPulseFill } from '@remixicon/react'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <>
            <Link href={'/menus/create'}>
                <Button>
                    <RiAddCircleFill  />
                    Add New Menu
                </Button>
            </Link>
        </>
    )
}

export default page