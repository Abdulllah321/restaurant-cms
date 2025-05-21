import PageHeader from "@/components/common/PageHeader"
import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"

const UsersPage = async () => {
    return (
        <div>
            <PageHeader
                title="Users Mangement"
                actionButtonLabel="Add New User"
            />
            <DataTable />
        </div>
    )
}

export default UsersPage