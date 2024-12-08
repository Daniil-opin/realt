// UserSale.tsx
"use client";

import { useState, useEffect } from "react";
import {
  BuildingOffice2Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "../input/text";
import { InputNumber } from "../input/number";
import InputTextarea from "../input/textarea";
import Image from "next/image";
import YandexMap from "../map/yandex";
import { InputCheckbox } from "../input/consent";
import { InputFileImage } from "../input/file";
import { convertFileToBase64 } from "@/app/lib/utils";

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

// Определение схемы валидации с помощью Zod
const formSchema = z.object({
  dealType: z.enum(["buy", "rent"]).default("buy"),
  propertyType: z.enum(["residential", "commercial"]).default("residential"),
  propertyKind: z
    .enum(["apartment", "room", "house", "office", "garage", "warehouse"])
    .default("apartment"),
  coordinates: z.tuple([z.number(), z.number()]).default([53.9025, 27.5615]),
  address: z.object({
    region: z.string().default(""),
    district: z.string().default(""),
    localityType: z.enum(["village", "town", "agrotown"]).default("village"),
    locality: z.string().default(""),
    streetType: z
      .enum(["street", "avenue", "alley", "boulevard"])
      .default("street"),
    street: z.string().default(""),
    house: z.string().default(""),
    floor: z.string().default(""),
    corpus: z.string().default(""),
  }),
  amenities: z
    .object({
      internet: z.boolean().default(false),
      elevator: z.boolean().default(false),
      conditioner: z.boolean().default(false),
      heating: z.boolean().default(false),
      parking: z.boolean().default(false),
      furniture: z.boolean().default(false),
      watersupply: z.boolean().default(false),
    })
    .optional(),
  characteristics: z.object({
    rooms: z.string().default(""),
    totalArea: z.string().default(""),
    livingArea: z.string().default(""),
    year: z.string().default(""),
    period: z.enum(["long", "short"]).default("long"),
    price: z.string().default(""),
    payment: z.boolean().optional().default(false),
  }),
  description: z.string().default(""),
  images: z.array(z.string()).max(4).default([]),
});

type FormData = z.infer<typeof formSchema>;

export default function UserSale() {
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // Для хранения файлов, если понадобится

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({}),
  });

  const propertyType = watch("propertyType");
  const dealType = watch("dealType");
  const [coordinates, setCoordinates] = useState<[number, number]>([
    53.9025, 27.5615,
  ]);

  const localityOptions = [
    { value: "village", label: "д." },
    { value: "town", label: "г." },
    { value: "agrotown", label: "аг." },
  ];

  const streetOptions = [
    { value: "street", label: "ул." },
    { value: "avenue", label: "пр." },
    { value: "alley", label: "пер." },
    { value: "boulevard", label: "бул." },
  ];

  const periodOptions = [
    { value: "long", label: "Длительный" },
    { value: "short", label: "Кратковременный" },
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
    setValue("coordinates", coords);
    console.log("Новые координаты:", coords);
  };

  // Установка значения по умолчанию для propertyKind при изменении propertyType
  useEffect(() => {
    if (propertyType === "residential") {
      setValue("propertyKind", "apartment");
    } else if (propertyType === "commercial") {
      setValue("propertyKind", "office");
    }
  }, [propertyType, setValue]);

  // Обработка загрузки файлов
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];

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
        newImages.push(base64);
      } catch (error) {
        console.error("Ошибка при конвертации файла:", error);
      }
    }

    setImages((prev) => {
      const updated = [...prev, ...newImages].slice(0, 4);
      setValue("images", updated);
      return updated;
    });
  };

  // Удаление фотографии
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setValue("images", updated);
      return updated;
    });
  };

  // Обработка отправки формы
  const onSubmit = (data: FormData) => {
    // Установка координат из состояния
    data.coordinates = coordinates;

    // Логирование данных формы
    console.log("Данные формы:", data);
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
            selectedValue={watch("dealType")}
            onSelect={(value) => setValue("dealType", value)}
          />

          <SelectionCategory
            title="Тип недвижимости"
            options={propertyTypeOptions}
            selectedValue={watch("propertyType")}
            onSelect={(value) => setValue("propertyType", value)}
          />

          <div className="space-y-8">
            <div className="text-lg font-semibold">Вид недвижимости</div>
            <div className="grid grid-cols-3 gap-6">
              {filteredPropertyKinds.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setValue("propertyKind", option.value)}
                  className={`flex w-full max-w-64 cursor-pointer items-center justify-center space-x-2 rounded-xl border border-smooth bg-white px-8 py-5 ${
                    watch("propertyKind") === option.value
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
            />
          </div>
        </div>
        <form
          className="space-y-8 rounded-[20px] bg-white p-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Фото</h2>
            <div className="mb-4 flex flex-wrap gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <Image
                    src={img}
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
                <InputText
                  {...register("address.region")}
                  label=""
                  placeholder="Область"
                />
                <InputText
                  {...register("address.district")}
                  label=""
                  placeholder="Район"
                />
                <div className="flex space-x-2">
                  <CustomSelect
                    className="min-h-full"
                    id="localityType"
                    options={localityOptions}
                    {...register("address.localityType")}
                  />
                  <InputText
                    id="street"
                    {...register("address.locality")}
                    label=""
                    placeholder="Населённый пункт"
                  />
                </div>
                <div className="flex space-x-2">
                  <CustomSelect
                    className="min-h-full"
                    id="streetType"
                    options={streetOptions}
                    {...register("address.streetType")}
                  />
                  <InputText
                    {...register("address.street")}
                    label=""
                    placeholder="Название"
                  />
                </div>
                <InputNumber
                  {...register("address.house")}
                  label=""
                  placeholder="Дом"
                />
                <InputNumber
                  {...register("address.floor")}
                  label=""
                  placeholder="Этаж"
                />
                <InputNumber
                  {...register("address.corpus")}
                  label=""
                  placeholder="Корпус"
                />
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
                      {...register("amenities.internet")}
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="elevator"
                      label="Лифт"
                      {...register("amenities.elevator")}
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="conditioner"
                      label="Кондиционер"
                      {...register("amenities.conditioner")}
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="heating"
                      label="Отопление"
                      {...register("amenities.heating")}
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="parking"
                      label="Парковка"
                      {...register("amenities.parking")}
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="furniture"
                      label="Мебель"
                      {...register("amenities.furniture")}
                    />
                  </div>
                  <div className="space-y-3">
                    <InputCheckbox
                      width={24}
                      height={24}
                      className="text-sm"
                      id="watersupply"
                      label="Водоснабжение"
                      {...register("amenities.watersupply")}
                    />
                  </div>
                </div>
              </>
            )}
            <h3 className="text-base font-semibold">Характеристики</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <InputNumber
                  {...register("characteristics.rooms")}
                  label=""
                  placeholder="Количество комнат"
                />
              </div>
              <div className="space-y-3">
                <InputNumber
                  allowDecimal={true}
                  {...register("characteristics.totalArea")}
                  label=""
                  placeholder="Общая площадь"
                />
              </div>
              <div className="space-y-3">
                <InputNumber
                  allowDecimal={true}
                  {...register("characteristics.livingArea")}
                  label=""
                  placeholder="Жилая площадь"
                />
              </div>
              <div className="space-y-3">
                <InputNumber
                  {...register("characteristics.year")}
                  label=""
                  placeholder="Год"
                />
              </div>
              <div className="space-y-3">
                <CustomSelect
                  className="h-[54px]"
                  id="period"
                  options={periodOptions}
                  {...register("characteristics.period")}
                />
              </div>
              <div className="space-y-3">
                <InputNumber
                  {...register("characteristics.price")}
                  label={
                    dealType === "buy" ? "Стоимость" : "Стоимость за месяц"
                  }
                  placeholder={
                    dealType === "buy"
                      ? "Введите стоимость"
                      : "Введите стоимость за месяц"
                  }
                />
              </div>
              {dealType === "rent" && (
                <div className="space-y-3">
                  <InputCheckbox
                    className="text-sm"
                    id="payment"
                    label="Предоплата"
                    {...register("characteristics.payment")}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Описание</h2>
            <InputTextarea
              {...register("description")}
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
  // Добавляем пропсы для useForm
  [key: string]: any;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  options,
  placeholder,
  className = "",
  ...rest
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        className="block min-h-full w-full min-w-20 appearance-none rounded-lg border border-smooth bg-white px-4 py-2 text-sm leading-none text-black focus:border-blue focus:outline-none"
        {...rest}
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
