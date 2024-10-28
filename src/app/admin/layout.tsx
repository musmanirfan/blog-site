import AdminProtectedRoute from "@/HOC/admin-protected-route";
import { ReactNode } from "react";


type AdminLayoutTypes = {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutTypes) {
    return (

            <AdminProtectedRoute>
                {children}
            </AdminProtectedRoute>
    )
}
