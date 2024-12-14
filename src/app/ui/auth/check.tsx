"use client";

import { ReactNode, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "../icons/icons";
import { AuthContext } from "../context/auth";

interface AuthCheckProps {
  children: ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const { isLoading, isAuthenticated, isAdmin } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname()?.toLowerCase() || "";

  useEffect(() => {
    if (!isLoading) {
      const isAdminPath = pathname.split("/").includes("admin");
      const isUserPath = pathname.split("/").includes("user");
      const isRootPath = pathname === "/";

      if (isAdminPath) {
        if (!isAuthenticated || !isAdmin) {
          router.replace("/");
          return;
        }
      }

      if (isUserPath) {
        if (!isAuthenticated) {
          router.replace("/login");
          return;
        }
        if (isAdmin) {
          router.replace("/admin/estates");
          return;
        }
      }

      if (isRootPath) {
        if (isAuthenticated && isAdmin) {
          router.replace("/admin/estates");
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Spinner width="w-16" height="h-16" />
      </div>
    );
  }

  return <>{children}</>;
}
