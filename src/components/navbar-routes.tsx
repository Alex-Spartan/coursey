"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

const NavbarRoutes = () => {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.startsWith("/chapter");
  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
            Teacher mode
          </Button>
        </Link>
      )}
      <Avatar>
        <AvatarImage
          src={user?.picture || "https://github.com/shadcn.png"}
          alt="@shadcn"
        />
      </Avatar>
    </div>
  );
};
export default NavbarRoutes;
