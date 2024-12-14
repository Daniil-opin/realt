import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { differenceInDays } from "date-fns";
import { getProcessedSrc } from "@/app/lib/utils";
import {
  EstateRead,
  LocalityTypeLabels,
  StreetTypeLabels,
} from "@/app/lib/definitions";
import { HeartIcon } from "../icons/icons";
import {
  checkEstateInFavorites,
  addEstateToFavorites,
  removeEstateFromFavorites,
} from "@/app/seed/route";
import { AuthContext } from "../context/auth";
import { toast } from "react-toastify";

interface EstateCardProps {
  estate: EstateRead;
  searchQuery?: string; // Опциональный пропс для поиска
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="text-sm text-orange-500 underline">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function EstateCard({
  estate,
  searchQuery = "",
}: EstateCardProps) {
  const { isAuthenticated } = useContext(AuthContext);

  const imageUrl =
    estate.images.length > 0
      ? estate.images[0].image_url
      : "/images/placeholder.jpg";

  const price = estate.characteristics?.price ?? 0;
  const priceSuffix = estate.deal_type === "rent" ? " / месяц" : "";

  const addressParts: string[] = [];
  if (estate.address) {
    const {
      region,
      district,
      locality_type,
      locality,
      street_type,
      street,
      house,
    } = estate.address;
    if (street_type && street) {
      addressParts.push(`${StreetTypeLabels[street_type]} ${street}`);
    }
    if (house) addressParts.push(house);
    if (locality_type && locality) {
      addressParts.push(`${LocalityTypeLabels[locality_type]} ${locality}`);
    }
    if (district) {
      addressParts.push(`${district} район`);
    }
    if (region) {
      addressParts.push(`${region} область`);
    }
  }
  const fullAddress =
    addressParts.length > 0 ? addressParts.join(", ") : "Адрес не указан";

  const createdDate = new Date(estate.created_at);
  const now = new Date();
  const daysDiff = differenceInDays(now, createdDate);
  const showNewLabel = daysDiff <= 3;

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isAuthenticated) {
      const checkFavorite = async () => {
        try {
          const fav = await checkEstateInFavorites(estate.id, token);
          setIsFavorite(fav);
        } catch (error) {
          console.error("Не удалось проверить избранное:", error);
        } finally {
          setLoadingFavorite(false);
        }
      };
      checkFavorite();
    } else {
      setLoadingFavorite(false);
    }
  }, [estate.id, isAuthenticated]);

  const handleFavoriteClick = async () => {
    const token = localStorage.getItem("token");
    if (!token || !isAuthenticated) {
      toast.warn("Пожалуйста, войдите в систему для добавления в избранное");
      return;
    }
    if (loadingFavorite) return;

    try {
      setLoadingFavorite(true);
      if (isFavorite) {
        // Удаляем из избранного
        await removeEstateFromFavorites(estate.id, token);
        setIsFavorite(false);
        toast.success("Убрано из избранного");
      } else {
        // Добавляем в избранное
        await addEstateToFavorites(estate.id, token);
        setIsFavorite(true);
        toast.success("Добавлено в избранное");
      }
    } catch (error) {
      console.error("Ошибка при изменении избранного:", error);
      toast.error("Не удалось изменить избранное");
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div className="relative space-y-6 rounded-[20px] bg-white">
      <div className="relative">
        <Image
          src={getProcessedSrc(imageUrl)}
          className="aspect-[20/11] rounded-t-[20px] object-cover object-top"
          width={800}
          height={800}
          alt="Изображение объекта"
        />
        {showNewLabel && (
          <div className="absolute right-5 top-5 flex items-center justify-start space-x-1 rounded-md bg-white px-2 py-[6px]">
            <Image
              src={"/icons/stars.svg"}
              width={14}
              height={14}
              className="h-[14px] w-[14px]"
              alt="Новое"
            />
            <span className="text-sm font-semibold uppercase text-blue">
              Новое
            </span>
          </div>
        )}
      </div>
      <div className="px-7 pb-8">
        <div className="mb-3 flex w-full items-center justify-between">
          <div className="flex w-max items-center justify-start rounded-xl bg-blue px-2 py-[6px] text-white">
            <span className="mr-1 text-2xl font-semibold uppercase">
              {`$${price.toLocaleString("en-US")}`}{" "}
            </span>
            <span>{priceSuffix}</span>
          </div>
          <button
            onClick={handleFavoriteClick}
            disabled={loadingFavorite}
            className="flex items-center justify-center rounded-full p-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.05)] focus:outline-none"
          >
            <HeartIcon
              fill={isFavorite ? "#2f6feb" : "none"}
              color={isFavorite ? "#2f6feb" : "#2f6feb"}
              className={`transition-transform duration-200 hover:scale-110 ${
                loadingFavorite ? "opacity-50" : "opacity-100"
              }`}
            />
          </button>
        </div>
        <p className="mb-6 text-sm leading-[1.5] text-black/70">
          {highlightMatch(fullAddress, searchQuery)}
        </p>
        <Link
          href={`/estates/${estate.id}`}
          className="block w-full rounded-xl border-[1px] border-black py-3 text-center text-sm font-semibold text-black/70 transition-all duration-200 hover:border-blue hover:bg-blue hover:text-white"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}
