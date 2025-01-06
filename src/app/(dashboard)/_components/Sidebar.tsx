import Logo from "./Logo";
import SidebarRoutes from "./Sidebar-Routes";

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6 flex items-center gap-4">
        <Logo />
        <p className="text-3xl font-semibold">Coursey</p>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
export default Sidebar;
