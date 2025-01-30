import Navbar from "./_components/navbar";
import Sidebar from "./_components/Sidebar";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[89px] md:pl-64 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-64 pt-[90px] h-full">{children}</main>
    </div>
  );
};
export default DashBoardLayout;
