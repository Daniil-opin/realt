"use client";

import React, { useEffect, useState, ChangeEvent, useMemo } from "react";
import Image from "next/image";
import {
  DealType,
  DealTypeLabels,
  PropertyType,
  PropertyTypeLabels,
  PropertyKind,
  PropertyKindLabels,
  Status,
  StatusLabels,
  EstateRead,
  LocalityTypeLabels,
  StreetTypeLabels,
} from "@/app/lib/definitions";
import {
  getAllEstates,
  deleteEstate,
  updateEstateStatus,
} from "@/app/seed/route";
import { capitalizeFirstLetter, getProcessedSrc } from "@/app/lib/utils";
import {
  ChevronDownIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Property {
  id: number;
  photo: string;
  dealType: DealType;
  propertyType: PropertyType;
  view: PropertyKind;
  location: string;
  price: string;
  status: Status;
}

const AdminPropertyTable: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchEstates = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res: EstateRead[] = await getAllEstates(token);
          const formattedProperties: Property[] = res.map((estate) => ({
            id: estate.id,
            photo:
              estate.images.length > 0
                ? getProcessedSrc(estate.images[0].image_url)
                : "/images/placeholder.jpg",
            dealType: estate.deal_type as DealType,
            propertyType: estate.property_type as PropertyType,
            view: estate.property_kind as PropertyKind,
            location: formatAddress(estate.address),
            price: formatPrice(estate.characteristics?.price),
            status: estate.status as Status,
          }));
          setProperties(formattedProperties);
        } catch (err) {
          setError("Ошибка получения недвижимости");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        // Если нет токена, можно либо ничего не делать, либо вернуть ошибку/пустой список
        setLoading(false);
      }
    };

    fetchEstates();
  }, []);

  const formatAddress = (address?: EstateRead["address"]): string => {
    if (!address) return "Не указано";
    const {
      region,
      district,
      locality_type,
      locality,
      street_type,
      street,
      house,
    } = address;

    return [
      `${StreetTypeLabels[street_type as keyof typeof StreetTypeLabels]} ${capitalizeFirstLetter(street || "")}`,
      house ? house : "",
      locality_type && locality
        ? `${LocalityTypeLabels[address.locality_type as keyof typeof LocalityTypeLabels]} ${capitalizeFirstLetter(locality || "")}`
        : "",
      district ? `${capitalizeFirstLetter(district)} район` : "",
      region ? `${capitalizeFirstLetter(region)} область` : "",
    ]
      .filter(Boolean)
      .join(", ");
  };

  const formatPrice = (price?: number): string => {
    if (price === undefined || price === null) return "Не указано";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить эту недвижимость?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Токен не найден");

        await deleteEstate(id, token);
        setProperties(properties.filter((property) => property.id !== id));
        toast.success("Недвижимость успешно удалена");
      } catch (err) {
        toast.error("Не удалось удалить недвижимость");
        console.error(err);
      }
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className="text-orange-500 underline">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Нет токена");
      return;
    }
    try {
      const updatedEstate = await updateEstateStatus(id, token, newStatus);
      setProperties((prev) =>
        prev.map((prop) =>
          prop.id === id
            ? { ...prop, status: updatedEstate.status as Status }
            : prop,
        ),
      );
      toast.success("Статус успешно изменён");
    } catch (error) {
      toast.error("Не удалось изменить статус");
      console.error(error);
    }
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const filteredProperties = useMemo(() => {
    if (!searchQuery) return properties;
    return properties.filter((property) =>
      property.location.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [properties, searchQuery]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="font-semibold text-gray-500">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="font-semibold text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="mb-24 mt-12">
      <h2 className="mb-5 text-3xl font-semibold">Объекты недвижимости</h2>
      <div className="mb-10">
        <input
          type="text"
          placeholder="Поиск по адресу"
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          className="w-full max-w-sm rounded-xl border px-4 py-5 leading-none focus:border-blue focus:outline-none"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="hidden min-w-full rounded-xl bg-white lg:table">
          <thead>
            <tr>
              <th className="border-b p-4 font-semibold">ID</th>
              <th className="border-b p-4 font-semibold">Фото</th>
              <th className="border-b p-4 font-semibold">Тип сделки</th>
              <th className="border-b p-4 font-semibold">Тип</th>
              <th className="border-b p-4 font-semibold">Вид</th>
              <th className="border-b p-4 font-semibold">Местоположение</th>
              <th className="border-b p-4 font-semibold">Цена</th>
              <th className="border-b p-4 font-semibold">Статус</th>
              <th className="border-b p-4 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.id} className="text-center">
                <td className="break-all border-b p-4 font-medium">
                  {property.id}
                </td>
                <td className="border-b p-4">
                  <Image
                    src={property.photo}
                    alt={`Property ${property.id}`}
                    width={60}
                    height={60}
                    className="mx-auto rounded"
                  />
                </td>
                <td className="border-b p-4 font-medium">
                  {DealTypeLabels[property.dealType]}
                </td>
                <td className="border-b p-4 font-medium">
                  {PropertyTypeLabels[property.propertyType]}
                </td>
                <td className="border-b p-4 font-medium">
                  {PropertyKindLabels[property.view]}
                </td>
                <td className="break-all border-b p-4 font-medium">
                  {highlightMatch(property.location, searchQuery)}
                </td>
                <td className="border-b p-4 font-medium">{property.price}</td>
                <td className="border-b p-4 font-medium">
                  <div className="relative inline-block">
                    <select
                      value={property.status}
                      onChange={(e) =>
                        handleStatusChange(property.id, e.target.value)
                      }
                      className="w-full appearance-none border border-black bg-white py-2 pl-4 pr-10 text-black focus:border-blue focus:outline-none"
                    >
                      {Object.entries(StatusLabels).map(([key, label]) => (
                        <option className="rounded-none" key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
                  </div>
                </td>
                <td className="space-x-3 border-b p-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => router.push(`/estates/${property.id}`)}
                    aria-label="Редактировать"
                  >
                    <EyeIcon className="h-5 w-5 transition-all duration-200 hover:text-blue" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(property.id)}
                    aria-label="Удалить"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Мобильная версия */}
        <div className="mt-4 space-y-4 lg:hidden">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center">
                <Image
                  src={property.photo}
                  alt={`Property ${property.id}`}
                  width={50}
                  height={50}
                  className="rounded"
                />
                <div className="ml-4">
                  <h2 className="break-all text-lg font-semibold">
                    ID: {property.id}
                  </h2>
                  <p className="break-all text-sm font-medium text-gray-600">
                    {DealTypeLabels[property.dealType]}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="break-all font-medium">
                  <span className="font-semibold">Тип:</span>
                  {PropertyTypeLabels[property.propertyType]}
                </div>
                <div className="break-all font-medium">
                  <span className="font-semibold">Вид:</span>
                  {PropertyKindLabels[property.view]}
                </div>
                <div className="break-all font-medium">
                  <span className="font-semibold">Местоположение:</span>
                  {highlightMatch(property.location, searchQuery)}
                </div>
                <div className="break-all font-medium">
                  <span className="font-semibold">Цена:</span>
                  {property.price}
                </div>
                <div className="break-all font-medium">
                  <span className="font-semibold">Статус:</span>
                  {/* Добавляем select для мобильной версии */}
                  <div className="relative mt-1 inline-block w-full">
                    <select
                      value={property.status}
                      onChange={(e) =>
                        handleStatusChange(property.id, e.target.value)
                      }
                      className="w-full appearance-none border border-black bg-white py-2 pl-4 pr-10 text-black focus:border-blue focus:outline-none"
                    >
                      {Object.entries(StatusLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => router.push(`/estates/${property.id}`)}
                  aria-label="Редактировать"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(property.id)}
                  aria-label="Удалить"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPropertyTable;
