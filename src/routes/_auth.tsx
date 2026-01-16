import { createRootRoute, Outlet, useRouterState, createFileRoute, redirect } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import {Navbar01} from "@/components/ui/shadcn-io/navbar-01";

export const Route = createFileRoute("/_auth")({
    component: AuthLayout,
    beforeLoad: ({ context, location}) => {
        if(context.auth){
        console.log(location);
        throw redirect({
                to: '/dashboard',
                });
        }
    }
})

export default function AuthLayout() {
    const { location } = useRouterState()
    
    
    const { auth } = Route.useRouteContext();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar01 auth={auth}></Navbar01>
            <div className="w-full h-full flex-1 flex transition-none">
              <Outlet />
            </div>
        </div>
    )
}
