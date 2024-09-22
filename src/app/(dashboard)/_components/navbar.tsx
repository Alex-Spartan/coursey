import NavbarRoutes from "@/components/navbar-routes"
import MobileSidebar from "./mobile-sidebar"

const Navbar = () => {
  return (
    <div className="p-4 broder-b h-full flex items-center bg-white shadow-sm">
        <MobileSidebar />
        <NavbarRoutes />
    </div>
  )
}
export default Navbar