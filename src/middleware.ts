import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";


export default withAuth(
  async function middleware(req: NextRequest) {},
  {
    publicPaths: ["/api/webhook"],
  }
);
export const config = {
  matcher: ["/teacher/:path*"],
};