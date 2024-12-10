"use client";

import { useState, useEffect } from "react";
import {
  BuildingOffice2Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { InputText } from "../input/text";
import { InputNumber } from "../input/number";
import InputTextarea from "../input/textarea";
import Image from "next/image";
import dynamic from "next/dynamic";
import { InputCheckbox } from "../input/consent";
import { InputFileImage } from "../input/file";
import { convertFileToBase64 } from "@/app/lib/utils";
import {
  EstateCreate,
  LocalityType,
  Period,
  StreetType,
} from "@/app/lib/definitions";
import { createEstate } from "@/app/seed/route";

interface SelectOption {
  value: string;
  label: string;
  iconSrc?: string;
  iconComponent?: React.ReactNode;
}

interface SelectionCategoryProps {
  title: string;
  options: SelectOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const YandexMap = dynamic(() => import("../map/yandex"), {
  ssr: false,
  loading: () => <p>Загрузка карты...</p>,
});

const SelectionCategory: React.FC<SelectionCategoryProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className="space-y-8">
      <div className="text-lg font-semibold">{title}</div>
      <div className="flex items-center justify-start space-x-5">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`flex w-full max-w-64 cursor-pointer items-center justify-center space-x-2 rounded-xl border border-smooth bg-white px-8 py-5 ${
              selectedValue === option.value
                ? "scale-105 transform opacity-100"
                : "opacity-45 hover:opacity-60"
            }`}
          >
            {option.iconSrc ? (
              <Image
                src={option.iconSrc}
                width={18}
                height={18}
                alt={option.label}
              />
            ) : (
              option.iconComponent
            )}
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function UserSale() {
  const [coordinates, setCoordinates] = useState<[number, number]>([
    53.9025, 27.5615,
  ]);
  const [dealType, setDealType] = useState<string>("buy");
  const [propertyType, setPropertyType] = useState<string>("residential");
  const [propertyKind, setPropertyKind] = useState<string>("apartment");
  const [images, setImages] = useState<{ file: File; base64: string }[]>([]);
  const [payment, setPayment] = useState<boolean>(false);

  const localityOptions = [
    { value: LocalityType.Village, label: "д." },
    { value: LocalityType.Town, label: "г." },
    { value: LocalityType.Agrotown, label: "аг." },
  ];

  const streetOptions = [
    { value: StreetType.Street, label: "ул." },
    { value: StreetType.Avenue, label: "пр." },
    { value: StreetType.Alley, label: "пер." },
    { value: StreetType.Boulevard, label: "бул." },
  ];

  const periodOptions = [
    { value: Period.Long, label: "Длительный" },
    { value: Period.Short, label: "Кратковременный" },
  ];

  const dealTypeOptions: SelectOption[] = [
    {
      value: "buy",
      label: "Купля",
      iconSrc: "/icons/add/iconKey.svg",
    },
    {
      value: "rent",
      label: "Аренда",
      iconSrc: "/icons/add/iconCalendar.svg",
    },
  ];

  const propertyTypeOptions: SelectOption[] = [
    {
      value: "residential",
      label: "Жилая",
      iconSrc: "/icons/add/iconLiving.svg",
    },
    {
      value: "commercial",
      label: "Коммерческая",
      iconSrc: "/icons/add/iconShop.svg",
    },
  ];

  const propertyKindOptions: SelectOption[] = [
    {
      value: "apartment",
      label: "Квартира",
      iconSrc: "/icons/add/iconSkyscraper.svg",
    },
    {
      value: "room",
      label: "Комната",
      iconSrc: "/icons/add/iconRoom.svg",
    },
    {
      value: "house",
      label: "Дом",
      iconSrc: "/icons/add/iconHome.svg",
    },
    {
      value: "office",
      label: "Офис",
      iconComponent: <BuildingOffice2Icon className="h-5 w-5" />,
    },
    {
      value: "garage",
      label: "Гараж",
      iconSrc: "/icons/add/iconGarage.svg",
    },
    {
      value: "warehouse",
      label: "Склад",
      iconSrc: "/icons/add/iconWarehouse.svg",
    },
  ];

  const filteredPropertyKinds =
    propertyType === "residential"
      ? propertyKindOptions.slice(0, 3)
      : propertyType === "commercial"
        ? propertyKindOptions.slice(3)
        : [];

  const handleCoordinatesChange = (coords: [number, number]) => {
    setCoordinates(coords);
    console.log("Новые координаты:", coords);
  };

  useEffect(() => {
    if (propertyType === "residential") {
      setPropertyKind("apartment");
    } else if (propertyType === "commercial") {
      setPropertyKind("office");
    }
  }, [propertyType]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: { file: File; base64: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (images.length + newImages.length >= 4) {
        alert("Максимум 4 фотографии.");
        break;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`Файл ${file.name} превышает 10 МБ.`);
        continue;
      }
      try {
        const base64 = await convertFileToBase64(file);
        newImages.push({ file, base64 });
      } catch (error) {
        console.error("Ошибка при конвертации файла:", error);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Используем роутер для перенаправления
  // const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: EstateCreate = {
      deal_type: dealType,
      property_type: propertyType,
      property_kind: propertyKind,
      latitude: coordinates[0],
      longitude: coordinates[1],
      description:
        (document.getElementById("description") as HTMLTextAreaElement)
          ?.value || undefined,
      address: {
        region:
          (document.getElementById("region") as HTMLInputElement)?.value ||
          undefined,
        district:
          (document.getElementById("district") as HTMLInputElement)?.value ||
          undefined,
        locality_type:
          (document.getElementById("localityType") as HTMLSelectElement)
            ?.value || undefined,
        locality:
          (document.getElementById("locality") as HTMLInputElement)?.value ||
          undefined,
        street_type:
          (document.getElementById("streetType") as HTMLSelectElement)?.value ||
          undefined,
        street:
          (document.getElementById("street") as HTMLInputElement)?.value ||
          undefined,
        house:
          (document.getElementById("house") as HTMLInputElement)?.value ||
          undefined,
        floor:
          (document.getElementById("floor") as HTMLInputElement)?.value ||
          undefined,
        corpus:
          (document.getElementById("corpus") as HTMLInputElement)?.value ||
          undefined,
      },
      amenities:
        propertyType === "residential"
          ? {
              internet: (
                document.getElementById("internet") as HTMLInputElement
              ).checked,
              elevator: (
                document.getElementById("elavator") as HTMLInputElement
              ).checked,
              conditioner: (
                document.getElementById("conditioner") as HTMLInputElement
              ).checked,
              heating: (document.getElementById("heating") as HTMLInputElement)
                .checked,
              parking: (document.getElementById("parking") as HTMLInputElement)
                .checked,
              furniture: (
                document.getElementById("furniture") as HTMLInputElement
              ).checked,
              watersupply: (
                document.getElementById("watersupply") as HTMLInputElement
              ).checked,
            }
          : undefined, // Заменили null на undefined
      characteristics: {
        rooms:
          parseInt(
            (document.getElementById("rooms") as HTMLInputElement)?.value ||
              "0",
          ) || undefined,
        total_area:
          parseFloat(
            (document.getElementById("totalArea") as HTMLInputElement)?.value ||
              "0",
          ) || undefined,
        living_area:
          parseFloat(
            (document.getElementById("livingArea") as HTMLInputElement)
              ?.value || "0",
          ) || undefined,
        year:
          parseInt(
            (document.getElementById("year") as HTMLInputElement)?.value || "0",
          ) || undefined,
        period:
          (document.getElementById("period") as HTMLSelectElement)?.value ||
          "long",
        price:
          parseFloat(
            (document.getElementById("price") as HTMLInputElement)?.value ||
              "0",
          ) || undefined,
        payment:
          dealType === "rent"
            ? (document.getElementById("payment") as HTMLInputElement)?.checked
            : undefined,
      },
      images: images.map((img) => ({
        image_base64: img.base64.startsWith("data:image")
          ? img.base64.split(",")[1]
          : img.base64,
      })),
    };

    try {
      const authToken = localStorage.getItem("token") || undefined;

      if (!authToken) {
        alert("Вы должны войти в систему для создания недвижимости.");
        return;
      }

      // Отправляем данные на сервер
      const createdEstate = await createEstate(formData, authToken);

      console.log("Созданная недвижимость:", createdEstate);
    } catch (error) {
      alert(`Ошибка при создании недвижимости: ${error}`);
    }
  };

  return (
    <>
      <h2 className="my-12 text-3xl font-semibold text-black">
        Персональная информация
      </h2>
      <div className="mb-24 grid grid-cols-2 gap-x-20">
        <div className="space-y-10">
          <SelectionCategory
            title="Тип сделки"
            options={dealTypeOptions}
            selectedValue={dealType}
            onSelect={setDealType}
          />

          <SelectionCategory
            title="Тип недвижимости"
            options={propertyTypeOptions}
            selectedValue={propertyType}
            onSelect={setPropertyType}
          />

          <div className="space-y-8">
            <div className="text-lg font-semibold">Вид недвижимости</div>
            <div className="grid grid-cols-3 gap-6">
              {filteredPropertyKinds.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setPropertyKind(option.value)}
                  className={`flex w-full max-w-64 cursor-pointer items-center justify-center space-x-2 rounded-xl border border-smooth bg-white px-8 py-5 ${
                    propertyKind === option.value
                      ? "scale-105 transform opacity-100"
                      : "opacity-50 hover:opacity-70"
                  }`}
                >
                  {option.iconSrc ? (
                    <Image
                      src={option.iconSrc}
                      width={18}
                      height={18}
                      alt={option.label}
                    />
                  ) : (
                    option.iconComponent
                  )}
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="text-lg font-semibold">Местоположение на карте</div>
            <YandexMap
              onCoordinatesChange={handleCoordinatesChange}
              editable={true}
              height="500px"
            />
          </div>
        </div>
        <form
          className="space-y-8 rounded-[20px] bg-white p-10"
          onSubmit={handleSubmit}
        >
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Фото</h2>
            <div className="mb-4 flex flex-wrap gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <Image
                    src={img.base64}
                    alt={`Фото ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded bg-transparent p-1 text-transparent transition-all duration-200 hover:bg-black/60 hover:text-white"
                  >
                    <XMarkIcon className="h-10 w-10" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <InputFileImage
                multiple={true}
                id="images"
                label=""
                onChange={handleFileChange}
                disabled={images.length >= 4}
              />
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Расположение</h2>
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Адрес</h3>
              <div className="space-y-3">
                <InputText id="region" label="" placeholder="Область" />
                <InputText id="district" label="" placeholder="Район" />
                <div className="flex space-x-2">
                  <CustomSelect
                    className="min-h-full"
                    id="localityType"
                    options={localityOptions}
                  />
                  <InputText
                    id="locality"
                    label=""
                    placeholder="Населённый пункт"
                  />
                </div>
                <div className="flex space-x-2">
                  <CustomSelect
                    className="min-h-full"
                    id="streetType"
                    options={streetOptions}
                  />
                  <InputText id="street" label="" placeholder="Название" />
                </div>
                <InputNumber id="house" label="" placeholder="Дом" />
                <InputNumber id="floor" label="" placeholder="Этаж" />
                <InputNumber id="corpus" label="" placeholder="Корпус" />
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Доп. информация</h2>
            {propertyType !== "commercial" && (
              <>
                <h3 className="text-base font-semibold">Удобства</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="internet"
                      label="Интернет"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="elavator"
                      label="Лифт"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="conditioner"
                      label="Кондиционер"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="heating"
                      label="Отопление"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="parking"
                      label="Парковка"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="furniture"
                      label="Мебель"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="watersupply"
                      label="Водоснабжение"
                      placeholder=""
                    />
                  </div>
                </div>
              </>
            )}
            <h3 className="text-base font-semibold">Характеристики</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <InputNumber
                  id="rooms"
                  label=""
                  placeholder="Количество комнат"
                />
              </div>
              <div className="space-y-3">
                <InputNumber
                  allowDecimal={true}
                  id="totalArea"
                  label=""
                  placeholder="Общая площадь"
                />
              </div>
              <div className="space-y-3">
                <InputNumber
                  allowDecimal={true}
                  id="livingArea"
                  label=""
                  placeholder="Жилая площадь"
                />
              </div>
              <div className="space-y-3">
                <InputNumber id="year" label="" placeholder="Год" />
              </div>
              <div className="space-y-3">
                <CustomSelect
                  className="h-[54px]"
                  id="period"
                  options={periodOptions}
                  placeholder=""
                />
              </div>
              <div className="space-y-3">
                <InputNumber
                  id="price"
                  label=""
                  placeholder={
                    dealType === "buy"
                      ? "Введите стоимость"
                      : "Введите стоимость за месяц"
                  }
                />
              </div>
              <div className="space-y-3">
                <InputCheckbox
                  className="text-sm"
                  id="payment"
                  label="Предоплата"
                  placeholder=""
                  checked={payment}
                  onChange={() => setPayment((prev) => !prev)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Описание</h2>
            <InputTextarea
              label=""
              placeholder="Краткое описание привлекает больше внимания."
              id="description"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-blue px-7 py-3.5 font-semibold text-white"
          >
            Оставить объявление
          </button>
        </form>
      </div>
    </>
  );
}

interface CustomSelectProps {
  id: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  options,
  placeholder,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        className="block min-h-full w-full min-w-20 appearance-none rounded-lg border border-smooth bg-white px-4 py-2 text-sm leading-none text-black focus:border-blue focus:outline-none"
      >
        {!!placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
    </div>
  );
};
