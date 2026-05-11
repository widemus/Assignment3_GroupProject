import UsersClient from './UsersClient'

// page metadata for the admin users page
export const metadata = {
    title: 'Admin · Users',
}
export default function Page() {
    return <UsersClient />
}