import { createRootRoute, Outlet, useRouterState, createFileRoute } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import {Navbar01} from "@/components/ui/shadcn-io/navbar-01";

export const Route = createFileRoute("/_auth")({
    component: AuthLayout,
})

export default function AuthLayout() {
    const { location } = useRouterState()

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar01></Navbar01>
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full flex-1 flex"
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
