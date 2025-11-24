"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Simple client-side auth guard.
 * - Redirects to /login when no auth_user is found in localStorage.
 * - Allows access to public routes.
 */
export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  // List public routes that don't require auth
  const publicPaths = new Set(["/", "/login", "/signup"]);

  useEffect(() => {
    // run only on client
    const user = typeof window !== "undefined" && localStorage.getItem("auth_user");

    if (!user && !publicPaths.has(pathname)) {
      // replace so user can't go back to protected page
      router.replace("/login");
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) return null;

  return <>{children}</>;
}
