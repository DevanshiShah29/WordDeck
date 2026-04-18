"use client";

import { useEffect, useState, useMemo } from "react";
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

  // Memoize public paths so the Set isn't recreated on every render
  const publicPaths = useMemo(() => new Set(["/", "/login", "/signup"]), []);

  useEffect(() => {
    // 1. Skip check if it's a public path
    if (publicPaths.has(pathname)) {
      setChecked(true);
      return;
    }

    // 2. Check for user
    const user = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;

    if (!user) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [pathname, router, publicPaths]);

  // Prevent rendering the app tree until we know the user is allowed
  // This stops child components from firing their own API requests during auth check
  if (!checked && !publicPaths.has(pathname)) {
    return null;
  }

  return <>{children}</>;
}
