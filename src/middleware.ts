/* eslint-disable @typescript-eslint/no-unused-vars */
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";


export default withAuth(
  async function middleware(req: NextRequest) {
  },
  {
    publicPaths: [
      "/api/webhook",
      "/search",
      "/api/auth/:path*"
    ],
  }
);
export const config = {
  matcher: ["/teacher/:path*"],
};