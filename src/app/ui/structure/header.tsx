"use client";

import { useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "../logo/logo";
import { HeartIcon, UserIcon } from "../icons/icons";
import Image from "next/image";
import {
  Bars3Icon,
  BuildingOffice2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useClickOutsideAndEscape } from "@/app/lib/hooks";
import { AuthContext } from "../context/auth";
import { toast } from "react-toastify";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const dealType = searchParams.get("deal_type") || "";

  useClickOutsideAndEscape(dropdownRef, () => setMenuOpen(false));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleDealTypeChange = (dt: string) => {
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set("deal_type", dt);
    router.replace(`/estates?${urlParams.toString()}`);
  };

  return (
    <header className="w-full bg-white">
      <div className="container flex w-full items-center justify-between py-6">
        <div className="flex items-center justify-start space-x-14">
          <Logo />
          <nav className="hidden space-x-12 font-medium md:flex">
            <button
              className={`transition duration-200 hover:font-bold ${dealType === "buy" ? "font-bold text-black" : "font-medium"}`}
              onClick={() => handleDealTypeChange("buy")}
            >
              Купля
            </button>
            <button
              className={`transition duration-200 hover:font-bold ${dealType === "rent" ? "font-bold text-black" : "font-medium"}`}
              onClick={() => handleDealTypeChange("rent")}
            >
              Аренда
            </button>
            {isLoading ? (
              <></>
            ) : isAuthenticated ? (
              <button
                className={`transition duration-200 hover:font-bold ${pathname.split("/").includes("sale") ? "font-bold text-black" : "font-medium"}`}
                onClick={() => router.push("/sale")}
              >
                Продажа
              </button>
            ) : (
              <></>
            )}
          </nav>
        </div>

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
                {!isLoading && (
                  <li
                    className="animate-fadeInUp animation-delay-100 opacity-0"
                    style={{ animationFillMode: "forwards" }}
                  >
                    <UserIcon
                      onClick={() =>
                        router.push(isAuthenticated ? "/user/profile" : "/auth")
                      }
                      fill="none"
                      color={isAuthenticated ? "black" : "#2f6feb"}
                      width={24}
                      height={24}
                      className="cursor-pointer text-blue transition-transform duration-200 hover:scale-110"
                    />
                  </li>
                )}

                <li
                  className="animate-fadeInUp animation-delay-200 opacity-0"
                  style={{ animationFillMode: "forwards" }}
                >
                  <Link href={"tel:+375292417581"}>
                    <Image
                      width={20}
                      height={20}
                      src={"/icons/iconPhone.svg"}
                      alt="Телефон"
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    />
                  </Link>
                </li>
                {isAuthenticated && (
                  <li
                    className="animate-fadeInUp animation-delay-300 opacity-0"
                    style={{ animationFillMode: "forwards" }}
                  >
                    <HeartIcon
                      width={22}
                      height={22}
                      fill={"none"}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      onClick={() => {
                        router.push("/user/favourites");
                      }}
                    />
                  </li>
                )}
                {isAuthenticated && (
                  <li
                    className="animate-fadeInUp animation-delay-400 opacity-0"
                    style={{ animationFillMode: "forwards" }}
                  >
                    <BuildingOffice2Icon
                      onClick={() => {
                        router.push("/user/estates");
                      }}
                      width={22}
                      height={22}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    />
                  </li>
                )}
                {isAuthenticated && (
                  <li
                    className="animate-fadeInUp animation-delay-500 opacity-0"
                    style={{ animationFillMode: "forwards" }}
                  >
                    <Image
                      onClick={() => {
                        router.push("/");
                        logout();
                        toast.success("Вы успешно вышли");
                      }}
                      width={22}
                      height={22}
                      src={"/icons/exit.svg"}
                      alt="Выйти"
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    />
                  </li>
                )}
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
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </header>
  );
}
