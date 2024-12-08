"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { capitalizeFirstLetter } from "@/app/lib/utils";

const segmentNameMap: { [key: string]: string } = {
  admin: "Админ",
  user: "Пользователь",
  profile: "Профиль",
  favourites: "Избранное",
  rent: "Аренда",
  buy: "Купля",
  estates: "Недвижимость",
  sale: "Продажа",
};

export const nonClickableSegments: string[] = ["admin", "user"];

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<
    { name: string; href: string; segment: string }[]
  >([]);

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const pathSegments = pathname.split("/").filter((segment) => segment);
      const crumbs: { name: string; href: string; segment: string }[] = [];
      let accumulatedPath = "";

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        accumulatedPath += `/${segment}`;

        const name = segmentNameMap[segment] || capitalizeFirstLetter(segment);

        crumbs.push({ name, href: accumulatedPath, segment });
      }

      setBreadcrumbs(crumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return (
    <nav
      className="my-12 flex flex-wrap font-medium leading-normal text-black"
      aria-label="breadcrumb"
    >
      <Link href="/" className="text-sm transition-colors duration-200">
        Главная
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <span key={index} className="flex items-center text-sm text-black">
          <span className="mx-3 text-sm">/</span>
          {index === breadcrumbs.length - 1 ? (
            <span className="text-sm">{crumb.name}</span>
          ) : nonClickableSegments.includes(crumb.segment) ? (
            <span className="text-sm">{crumb.name}</span>
          ) : (
            <Link href={crumb.href} className="text-sm transition-colors">
              {crumb.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};
