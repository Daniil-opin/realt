"use client";

import Logo from "../logo/logo";
import Image from "next/image";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/auth";
import { useRouter, usePathname } from "next/navigation";
import {
  Bars3Icon,
  BuildingOffice2Icon,
  ChartPieIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useClickOutsideAndEscape } from "@/app/lib/hooks";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useClickOutsideAndEscape(dropdownRef, () => setMenuOpen(false));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="w-full bg-white">
      <div className="container flex w-full items-center justify-between py-6">
        <Logo />

        <div className="relative mr-2 flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
            aria-label="Меню"
          >
            {menuOpen ? (
              <XMarkIcon className="h-8 w-8 text-black" />
            ) : (
              <Bars3Icon className="h-8 w-8 text-black" />
            )}
          </button>

          {menuOpen && (
            <div
              ref={dropdownRef}
              className="absolute left-1/2 top-full z-50 mt-6 w-max -translate-x-1/2 rounded-md border border-black/5 bg-white p-4"
            >
              <ul className="flex flex-col items-center space-y-4">
                <li
                  className="animate-fadeInUp animation-delay-100 opacity-0"
                  style={{ animationFillMode: "forwards" }}
                >
                  <ChartPieIcon
                    onClick={() => router.push("/admin/analytics")}
                    fill="none"
                    color={isAuthenticated ? "black" : "#2f6feb"}
                    width={24}
                    height={24}
                    className="cursor-pointer text-black transition-transform duration-200 hover:scale-110"
                  />
                </li>
                <li
                  className="animate-fadeInUp animation-delay-200 opacity-0"
                  style={{ animationFillMode: "forwards" }}
                >
                  <UsersIcon
                    width={22}
                    height={22}
                    fill={"none"}
                    className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    onClick={() => {
                      router.push("/admin/users");
                    }}
                  />
                </li>
                <li
                  className="animate-fadeInUp animation-delay-300 opacity-0"
                  style={{ animationFillMode: "forwards" }}
                >
                  <BuildingOffice2Icon
                    width={22}
                    height={22}
                    fill={"none"}
                    className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    onClick={() => {
                      router.push("/admin/estates");
                    }}
                  />
                </li>
                <li
                  className="animate-fadeInUp animation-delay-400 opacity-0"
                  style={{ animationFillMode: "forwards" }}
                >
                  <Image
                    onClick={() => {
                      router.push("/");
                      logout();
                    }}
                    width={22}
                    height={22}
                    src={"/icons/exit.svg"}
                    alt="Выйти"
                    className="cursor-pointer transition-transform duration-200 hover:scale-110"
                  />
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </header>
  );
}