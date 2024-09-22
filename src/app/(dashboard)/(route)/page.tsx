import { getKindeServerSession, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
 const { isAuthenticated, getUser} = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();


  if (!isUserAuthenticated) {
    return redirect("/api/auth/login");
  }
  return <div className="flex">
      <div>
        button
      </div>
  </div>;
};
export default page;
