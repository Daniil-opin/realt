import Image from "next/image";
import Link from "next/link";
import { differenceInDays } from "date-fns";
import { getProcessedSrc } from "@/app/lib/utils";
import {
  EstateRead,
  LocalityTypeLabels,
  StreetTypeLabels,
} from "@/app/lib/definitions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface EstateEditCardProps {
  estate: EstateRead;
  searchQuery?: string; // Передаем строку поиска для подсветки
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-sm text-orange-500 underline">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function EstateEditCard({
  estate,
  searchQuery = "",
}: EstateEditCardProps) {
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
              ${price}
            </span>
            <span>{priceSuffix}</span>
          </div>
          <Link
            href={`/sale/${estate.id}`}
            className="flex items-center justify-center rounded-full p-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.05)]"
            aria-label="Редактировать"
          >
            <PencilSquareIcon className="text-blue-500 hover:text-blue-700 h-5 w-5 transition-transform duration-200 hover:scale-110" />
          </Link>
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
