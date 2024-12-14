import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../ui/context/auth";
import { useRouter } from "next/navigation";

type Handler = (event: MouseEvent | KeyboardEvent) => void;

export function useClickOutsideAndEscape(
  ref: React.RefObject<HTMLElement>,
  handler: Handler,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handler(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, handler]);
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useAuth() {
  return useContext(AuthContext);
}

interface UseRequireAuthOptions {
  requiredRole?: string;
}

const useRequireAuth = ({ requiredRole }: UseRequireAuthOptions = {}) => {
  const { isAuthenticated, isLoading, isAdmin } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/signin");
      } else if (requiredRole === "admin" && !isAdmin) {
        router.push("/unauthorized");
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router, requiredRole]);

  return { isAuthenticated, isLoading, isAdmin };
};

export default useRequireAuth;
