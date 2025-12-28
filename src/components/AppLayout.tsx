import { Layout } from './Layout'
import { Outlet } from 'react-router-dom'

export const AppLayout = () => {
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}
