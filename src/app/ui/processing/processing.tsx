"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";

export default function Processing() {
  const [countFilter, setCountFilter] = useState<number>(10);
  const [sort, setSort] = useState<string>("По популярности");

  return (
    <>
      <div className="mb-12 flex w-full items-center justify-between">
        <div className="relative w-full max-w-[500px]">
          <Image
            width={24}
            height={24}
            src={"/icons/iconSearch.svg"}
            alt="Поиск"
            className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer"
          />
          <input
            id="search"
            placeholder="Поиск"
            type="text"
            className="min-h-14 w-full rounded-xl border border-smooth bg-transparent bg-white pl-14 pr-5 font-medium leading-none text-black placeholder:text-base placeholder:text-greyblue focus-within:border-blue focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-start space-x-10">
          <div className="flex cursor-pointer items-center justify-start space-x-1.5">
            <span className="font-medium">Фильтрация</span>
            {!!countFilter && (
              <span className="flex min-h-7 w-full max-w-7 items-center justify-center rounded-full bg-blue p-0.5 text-sm font-medium text-white transition-all duration-300">
                {countFilter}
              </span>
            )}
            <ChevronDownIcon className="h-7 w-7 transition-all duration-150" />
          </div>
          <div className="flex cursor-pointer items-center justify-start space-x-1.5">
            <span className="font-medium">{`Сортировка: ${sort}`}</span>
            <ChevronDownIcon className="h-5 w-5 transition-all duration-150" />
          </div>
        </div>
      </div>
    </>
  );
}
