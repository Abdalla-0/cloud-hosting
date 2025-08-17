import { verifyTokenForPage } from "@/utils/token";
import AdminSidebar from "./AdminSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AdminDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = verifyTokenForPage((await cookies()).get("token")?.value ?? "");
  if (!token || !token.isAdmin) redirect("/");
  return (
    <div className="overflow-height flex items-start justify-between overflow-hidden">
      <div className="overflow-height w-15 lg:w-1/5 bg-purple-600 text-white p-1 lg:p-5">
        <AdminSidebar />
      </div>
      <div className="overflow-height w-full lg:w-4/5 overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
