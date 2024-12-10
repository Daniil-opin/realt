"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { FilterParams } from "@/app/seed/route";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/app/lib/hooks";

export enum PropertyType {
  Residential = "residential",
  Commercial = "commercial",
}

export enum PropertyKind {
  Apartment = "apartment",
  Room = "room",
  House = "house",
  Office = "office",
  Garage = "garage",
  Warehouse = "warehouse",
}

type SortOption = "new" | "priceAsc" | "priceDesc" | "areaAsc" | "areaDesc";

interface SelectOption {
  value: string;
  label: string;
}

interface ProcessingProps {
  onFilterChange?: (filters: FilterParams) => void;
}

function setURLParams(
  router: ReturnType<typeof useRouter>,
  params: Record<string, any>,
) {
  const urlParams = new URLSearchParams();
  for (const key in params) {
    if (
      params[key] !== undefined &&
      params[key] !== "" &&
      params[key] !== null
    ) {
      urlParams.set(key, params[key].toString());
    }
  }
  const searchStr = urlParams.toString();
  router.replace(`?${searchStr}`);
}

export default function Processing({ onFilterChange }: ProcessingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialFilters = {
    property_type: "",
    property_kind: "",
    min_price: "",
    max_price: "",
    deal_type: "",
    area_range: "",
    search_query: "",
  };

  const [propertyType, setPropertyType] = useState<string>("");
  const [propertyKind, setPropertyKind] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [dealType, setDealType] = useState<string>("");
  const [areaRange, setAreaRange] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("new");
  const [priceError, setPriceError] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);

  const propertyTypeOptions: SelectOption[] = [
    { value: PropertyType.Residential, label: "Жилая" },
    { value: PropertyType.Commercial, label: "Коммерческая" },
  ];

  const propertyKindOptions: SelectOption[] = [
    { value: PropertyKind.Apartment, label: "Квартира" },
    { value: PropertyKind.Room, label: "Комната" },
    { value: PropertyKind.House, label: "Дом" },
    { value: PropertyKind.Office, label: "Офис" },
    { value: PropertyKind.Garage, label: "Гараж" },
    { value: PropertyKind.Warehouse, label: "Склад" },
  ];

  const areaRangeOptions = [
    { value: "0-50", label: "До 50 м²" },
    { value: "50-100", label: "50-100 м²" },
    { value: "100+", label: "Более 100 м²" },
  ];

  const dealTypeOptions = [
    { value: "buy", label: "Купля" },
    { value: "rent", label: "Аренда" },
  ];

  const sortOptions = [
    { value: "new", label: "Новые" },
    { value: "priceAsc", label: "Цена по возрастанию" },
    { value: "priceDesc", label: "Цена по убыванию" },
    { value: "areaAsc", label: "Площадь по возрастанию" },
    { value: "areaDesc", label: "Площадь по убыванию" },
  ];

  // Синхронизация состояний с URL параметрами при каждом изменении searchParams
  useEffect(() => {
    const dp = searchParams.get("deal_type") || "buy";
    setDealType(dp);

    const pt = searchParams.get("property_type") || "";
    setPropertyType(pt);

    const pk = searchParams.get("property_kind") || "";
    setPropertyKind(pk);

    const minp = searchParams.get("min_price") || "";
    setMinPrice(minp);

    const maxp = searchParams.get("max_price") || "";
    setMaxPrice(maxp);

    const ar = searchParams.get("area_range") || "";
    setAreaRange(ar);

    const srt = (searchParams.get("sort") as SortOption) || "new";
    setSort(srt);

    const sq = searchParams.get("search_query") || "";
    setSearchQuery(sq);
  }, [searchParams]);

  // Фильтруем виды недвижимости по типу
  let filteredPropertyKindOptions: SelectOption[] = [];
  if (propertyType === PropertyType.Residential) {
    filteredPropertyKindOptions = propertyKindOptions.slice(0, 3);
  } else if (propertyType === PropertyType.Commercial) {
    filteredPropertyKindOptions = propertyKindOptions.slice(3);
  }

  // Если property_type изменилось и у нас нет property_kind в списке, ставим первый вариант
  useEffect(() => {
    if (
      propertyType &&
      filteredPropertyKindOptions.length > 0 &&
      !filteredPropertyKindOptions.some((opt) => opt.value === propertyKind)
    ) {
      setPropertyKind(filteredPropertyKindOptions[0].value);
    }
  }, [propertyType, filteredPropertyKindOptions, propertyKind]);

  const calculateActiveFilters = () => {
    let count = 0;
    if (propertyType && propertyType !== initialFilters.property_type)
      count += 1;
    if (propertyKind && propertyKind !== initialFilters.property_kind)
      count += 1;
    if (minPrice && minPrice !== initialFilters.min_price) count += 1;
    if (maxPrice && maxPrice !== initialFilters.max_price) count += 1;
    if (dealType !== initialFilters.deal_type) count += 1; // теперь если deal_type=buy, оно не совпадает с ""
    if (areaRange && areaRange !== initialFilters.area_range) count += 1;
    if (searchQuery && searchQuery !== initialFilters.search_query) count += 1;
    return count;
  };

  const [countFilter, setCountFilter] = useState<number>(0);

  useEffect(() => {
    setCountFilter(calculateActiveFilters());
  }, [
    propertyType,
    propertyKind,
    minPrice,
    maxPrice,
    dealType,
    areaRange,
    searchQuery,
  ]);

  const applyFilters = (closeMenu = false) => {
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      setPriceError("Минимальная цена не может быть больше максимальной.");
      return;
    } else {
      setPriceError("");
    }

    const filters: FilterParams = {
      deal_type: dealType || "buy",
      property_type: propertyType || undefined,
      property_kind: propertyKind || undefined,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
      area_range: areaRange || undefined,
      sort: sort || "new",
      search_query: searchQuery || undefined,
    };

    setURLParams(router, {
      deal_type: filters.deal_type,
      property_type: filters.property_type,
      property_kind: filters.property_kind,
      min_price: filters.min_price,
      max_price: filters.max_price,
      area_range: filters.area_range,
      sort: filters.sort,
      search_query: filters.search_query,
    });

    if (onFilterChange) {
      onFilterChange(filters);
    }

    if (closeMenu) setIsMenuOpen(false);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(true);
  };

  const handleResetFilters = () => {
    setPropertyType(initialFilters.property_type);
    setPropertyKind(initialFilters.property_kind);
    setMinPrice(initialFilters.min_price);
    setMaxPrice(initialFilters.max_price);
    setDealType(initialFilters.deal_type);
    setAreaRange(initialFilters.area_range);
    setSearchQuery(initialFilters.search_query);
    setPriceError("");

    const filters: FilterParams = {
      deal_type: "buy",
      sort: "new",
    };

    setURLParams(router, filters);
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // При изменении сортировки или debouncedSearch - обновляем URL и вызов
  useEffect(() => {
    applyFilters(false);
  }, [sort, debouncedSearch]);

  useEffect(() => {
    applyFilters(false);
  }, [debouncedSearch]);

  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen]);

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
            placeholder="Поиск по адресу"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-h-14 w-full rounded-xl border border-smooth bg-transparent bg-white pl-14 pr-5 font-medium leading-none text-black placeholder:text-base placeholder:text-greyblue focus-within:border-blue focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-start space-x-10">
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative flex w-max cursor-pointer items-center justify-start space-x-1.5"
          >
            <span className="font-medium">Фильтрация</span>
            {!!countFilter && (
              <span className="flex min-h-7 min-w-7 items-center justify-center rounded-full bg-blue p-0.5 text-sm font-medium text-white transition-all duration-300">
                {countFilter}
              </span>
            )}
            <ChevronDownIcon className="min-h-5 min-w-5 transition-all duration-150" />
          </div>
          <div className="relative" ref={sortRef}>
            <div
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex cursor-pointer items-center justify-start space-x-1.5"
            >
              <span className="font-medium">
                Сортировка:{" "}
                {sortOptions.find((option) => option.value === sort)?.label ||
                  "Новые"}
              </span>
              <ChevronDownIcon className="h-5 w-5 transition-all duration-150" />
            </div>
            {isSortOpen && (
              <div className="absolute right-0 z-50 mt-2 w-max rounded-md bg-white shadow-lg">
                <ul className="py-1">
                  {sortOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        setSort(option.value as SortOption);
                        setIsSortOpen(false);
                      }}
                      className={`cursor-pointer px-4 py-2 hover:bg-blue hover:text-white ${
                        sort === option.value ? "bg-gray-100" : ""
                      }`}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-full w-96 transform bg-white shadow-lg ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Фильтры</h2>
          <button onClick={() => setIsMenuOpen(false)}>
            <XMarkIcon className="h-6 w-6 text-black transition-colors duration-200 hover:text-gray-800" />
          </button>
        </div>

        <form
          onSubmit={handleFilterSubmit}
          className="h-full space-y-6 overflow-y-auto p-6"
        >
          <div>
            <span className="block text-sm font-medium text-black">
              Тип недвижимости
            </span>
            <div className="mt-2 flex items-center space-x-4">
              {propertyTypeOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="property_type"
                    value={option.value}
                    checked={propertyType === option.value}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-blue focus:ring-blue"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {propertyType && (
            <div>
              <span className="block text-sm font-medium text-black">
                Вид недвижимости
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {filteredPropertyKindOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="property_kind"
                      value={option.value}
                      checked={propertyKind === option.value}
                      onChange={(e) => setPropertyKind(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-blue focus:ring-blue"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="block text-sm font-medium text-black">
              Площадь
            </span>
            <div className="mt-2">
              <div className="mt-1 flex items-center space-x-4">
                {areaRangeOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="area_range"
                      value={option.value}
                      checked={areaRange === option.value}
                      onChange={(e) => setAreaRange(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-blue focus:ring-blue"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-black">Цена</span>
            <div className="mt-2 flex space-x-4">
              <div className="flex flex-col">
                <input
                  type="number"
                  id="min_price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="От"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue focus:outline-none"
                  min="0"
                />
              </div>
              <div className="flex flex-col">
                <input
                  type="number"
                  id="max_price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="До"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue focus:outline-none"
                  min="0"
                />
              </div>
            </div>
            {priceError && (
              <p className="mt-1 text-xs text-red-600">{priceError}</p>
            )}
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700">
              Тип сделки
            </span>
            <div className="mt-2 flex items-center space-x-4">
              {dealTypeOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="deal_type"
                    value={option.value}
                    checked={dealType === option.value}
                    onChange={(e) => setDealType(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-blue focus:ring-blue"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="hover:bg-blue-600 w-full rounded-md bg-blue px-4 py-2 font-semibold text-white transition-colors duration-200"
            >
              Применить
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-300"
            >
              Сбросить
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
