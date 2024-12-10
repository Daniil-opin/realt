// components/edit/EditEstatePage.tsx

"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { InputFileImage } from "../input/file";
import { convertFileToBase64, getProcessedSrc } from "@/app/lib/utils";
import {
  EstateRead,
  DealType,
  PropertyType,
  PropertyKind,
  LocalityType,
  StreetType,
  Period,
} from "@/app/lib/definitions";
import { getEstateById, updateEstate } from "@/app/seed/route";
import { useParams, useRouter } from "next/navigation";
import { InputCheckbox } from "../input/consent";

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

// Задание схемы валидации с помощью Zod
const schema = z.object({
  deal_type: z.enum([DealType.Buy, DealType.Rent]),
  property_type: z.enum([PropertyType.Residential, PropertyType.Commercial]),
  property_kind: z.enum([
    PropertyKind.Apartment,
    PropertyKind.Room,
    PropertyKind.House,
    PropertyKind.Office,
    PropertyKind.Garage,
    PropertyKind.Warehouse,
  ]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().optional(),
  address: z
    .object({
      region: z.string().optional(),
      district: z.string().optional(),
      locality_type: z
        .enum([LocalityType.Village, LocalityType.Town, LocalityType.Agrotown])
        .optional(),
      locality: z.string().optional(),
      street_type: z
        .enum([
          StreetType.Street,
          StreetType.Avenue,
          StreetType.Alley,
          StreetType.Boulevard,
        ])
        .optional(),
      street: z.string().optional(),
      house: z.string().optional(),
      floor: z.string().optional(),
      corpus: z.string().optional(),
    })
    .optional(),
  amenities: z
    .object({
      internet: z.boolean().optional(),
      elevator: z.boolean().optional(),
      conditioner: z.boolean().optional(),
      heating: z.boolean().optional(),
      parking: z.boolean().optional(),
      furniture: z.boolean().optional(),
      watersupply: z.boolean().optional(),
    })
    .optional(),
  characteristics: z
    .object({
      rooms: z.number().int().optional(),
      total_area: z.number().optional(),
      living_area: z.number().optional(),
      year: z.number().int().optional(),
      period: z.enum([Period.Long, Period.Short]).optional(),
      price: z.number().optional(),
      payment: z.boolean().optional(),
    })
    .optional(),
  images: z.array(z.string()).max(4, "Максимум 4 фото"),
});

// Тип данных формы
type FormData = z.infer<typeof schema>;

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

// Компонент CustomSelect для интеграции с react-hook-form
interface CustomSelectProps {
  id: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  register: any;
  error?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  options,
  placeholder,
  className = "",
  register,
  error,
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        {...register(id)}
        className="block min-h-full w-full min-w-20 appearance-none rounded-lg border border-smooth bg-white px-4 py-2 text-sm leading-none text-black focus:border-blue focus:outline-none"
      >
        {placeholder && (
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
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default function EditEstatePage() {
  const params = useParams();
  const router = useRouter();
  const estateId = parseInt(params.id as string, 10);

  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<{ file: File; base64: string }[]>(
    [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      deal_type: DealType.Buy,
      property_type: PropertyType.Residential,
      property_kind: PropertyKind.Apartment,
      latitude: 53.9025,
      longitude: 27.5615,
      description: "",
      address: {
        region: "",
        district: "",
        locality_type: LocalityType.Village,
        locality: "",
        street_type: StreetType.Street,
        street: "",
        house: "",
        floor: "",
        corpus: "",
      },
      amenities: {
        internet: false,
        elevator: false,
        conditioner: false,
        heating: false,
        parking: false,
        furniture: false,
        watersupply: false,
      },
      characteristics: {
        rooms: 1,
        total_area: 1,
        living_area: 1,
        year: 2000,
        period: Period.Long,
        price: 100000,
        payment: false,
      },
      images: [],
    },
  });

  // Получение значений для отслеживания
  const watchPropertyType = watch("property_type", PropertyType.Residential);
  const watchDealType = watch("deal_type", DealType.Buy);

  const propertyKindOptions: SelectOption[] = [
    {
      value: PropertyKind.Apartment,
      label: "Квартира",
      iconSrc: "/icons/add/iconSkyscraper.svg",
    },
    {
      value: PropertyKind.Room,
      label: "Комната",
      iconSrc: "/icons/add/iconRoom.svg",
    },
    {
      value: PropertyKind.House,
      label: "Дом",
      iconSrc: "/icons/add/iconHome.svg",
    },
    {
      value: PropertyKind.Office,
      label: "Офис",
      iconComponent: <BuildingOffice2Icon className="h-5 w-5" />,
    },
    {
      value: PropertyKind.Garage,
      label: "Гараж",
      iconSrc: "/icons/add/iconGarage.svg",
    },
    {
      value: PropertyKind.Warehouse,
      label: "Склад",
      iconSrc: "/icons/add/iconWarehouse.svg",
    },
  ];

  const filteredPropertyKinds =
    watchPropertyType === PropertyType.Residential
      ? propertyKindOptions.slice(0, 3)
      : watchPropertyType === PropertyType.Commercial
        ? propertyKindOptions.slice(3)
        : [];

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
      value: DealType.Buy,
      label: "Купля",
      iconSrc: "/icons/add/iconKey.svg",
    },
    {
      value: DealType.Rent,
      label: "Аренда",
      iconSrc: "/icons/add/iconCalendar.svg",
    },
  ];

  const propertyTypeOptionsSelect: SelectOption[] = [
    {
      value: PropertyType.Residential,
      label: "Жилая",
      iconSrc: "/icons/add/iconLiving.svg",
    },
    {
      value: PropertyType.Commercial,
      label: "Коммерческая",
      iconSrc: "/icons/add/iconShop.svg",
    },
  ];

  // Загрузка данных о недвижимости при монтировании компонента
  useEffect(() => {
    const fetchEstate = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Вы должны войти в систему для редактирования недвижимости.");
          router.back();
          return;
        }
        const data: EstateRead = await getEstateById(estateId);
        // Преобразование существующих изображений
        const existingImages = data.images.map((img) =>
          getProcessedSrc(img.image_url),
        );
        setLoadedImages(existingImages);
        // Установка значений формы
        reset({
          deal_type: data.deal_type as DealType,
          property_type: data.property_type as PropertyType,
          property_kind: data.property_kind as PropertyKind,
          latitude: data.latitude,
          longitude: data.longitude,
          description: data.description || "",
          address: {
            region: data.address?.region || "",
            district: data.address?.district || "",
            locality_type: data.address?.locality_type || LocalityType.Town,
            locality: data.address?.locality || "",
            street_type: data.address?.street_type || StreetType.Street,
            street: data.address?.street || "",
            house: data.address?.house || "",
            floor: data.address?.floor || "",
            corpus: data.address?.corpus || "",
          },
          amenities: {
            internet: data.amenities?.internet || false,
            elevator: data.amenities?.elevator || false,
            conditioner: data.amenities?.conditioner || false,
            heating: data.amenities?.heating || false,
            parking: data.amenities?.parking || false,
            furniture: data.amenities?.furniture || false,
            watersupply: data.amenities?.watersupply || false,
          },
          characteristics: {
            rooms: data.characteristics?.rooms || 1,
            total_area: data.characteristics?.total_area || 1,
            living_area: data.characteristics?.living_area || 1,
            year: data.characteristics?.year || 2000,
            period: (data.characteristics?.period as Period) || Period.Long,
            price: data.characteristics?.price || 100000,
            payment: data.characteristics?.payment || false,
          },
          images: existingImages, // Подстановка существующих изображений
        });
      } catch (error: any) {
        alert("Не удалось загрузить данные недвижимости.");
        console.error(error);
        router.back();
      }
    };
    if (estateId) {
      fetchEstate();
    }
  }, [estateId, reset, router]);

  // Обработка изменений координат на карте
  const handleCoordinatesChange = (coords: [number, number]) => {
    setValue("latitude", coords[0]);
    setValue("longitude", coords[1]);
  };

  // Обработка добавления новых фотографий
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentTotalImages = loadedImages.length + newImages.length;

    const newImagesArray: { file: File; base64: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (currentTotalImages + newImagesArray.length >= 4) {
        alert("Максимум 4 фотографии.");
        break;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`Файл ${file.name} превышает 10 МБ.`);
        continue;
      }
      try {
        const base64 = await convertFileToBase64(file);
        newImagesArray.push({ file, base64 });
      } catch (error) {
        console.error("Ошибка при конвертации файла:", error);
      }
    }

    setNewImages((prev) => [...prev, ...newImagesArray]);
    const allImages = [
      ...loadedImages,
      ...newImagesArray.map((img) => img.base64),
    ];
    setValue("images", allImages);
  };

  // Обработка удаления фотографий
  const handleRemoveImage = (index: number, isNew: boolean) => {
    if (isNew) {
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(index, 1);
      setNewImages(updatedNewImages);
      const allImages = [
        ...loadedImages,
        ...updatedNewImages.map((img) => img.base64),
      ];
      setValue("images", allImages);
    } else {
      if (loadedImages.length + newImages.length <= 2) {
        alert("Минимум 2 фотографии.");
        return;
      }
      const updatedLoadedImages = [...loadedImages];
      updatedLoadedImages.splice(index, 1);
      setLoadedImages(updatedLoadedImages);
      const allImages = [
        ...updatedLoadedImages,
        ...newImages.map((img) => img.base64),
      ];
      setValue("images", allImages);
    }
  };

  // Обработка отправки формы
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Проверка количества фотографий
    const totalImages = loadedImages.length + newImages.length;
    if (totalImages < 2) {
      alert("Минимум 2 фотографии.");
      return;
    }
    if (totalImages > 4) {
      alert("Максимум 4 фотографии.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Вы должны войти в систему для обновления недвижимости.");
        return;
      }

      // Подготовка новых изображений для отправки
      const imagesToSend = newImages.map((img) => ({
        image_base64: img.base64.split(",")[1], // Удаление префикса data:image/...;base64,
      }));

      // Подготовка данных для обновления
      const estateUpdateData = {
        deal_type: data.deal_type,
        property_type: data.property_type,
        property_kind: data.property_kind,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        address: data.address,
        amenities:
          data.property_type === PropertyType.Residential
            ? data.amenities
            : undefined,
        characteristics: data.characteristics,
        images: imagesToSend,
      };

      // Отправка данных на сервер
      await updateEstate(estateId, estateUpdateData, token);
      alert("Данные успешно обновлены!");
      router.back();
    } catch (error: any) {
      console.error("Ошибка при обновлении недвижимости:", error);
      alert(`Ошибка при обновлении недвижимости: ${error.message || error}`);
    }
  };

  // Обработка отмены редактирования
  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <h2 className="my-12 text-3xl font-semibold text-black">
        Редактировать объявление
      </h2>
      <div className="mb-24 grid grid-cols-2 gap-x-20">
        <div className="space-y-10">
          {/* Тип сделки */}
          <SelectionCategory
            title="Тип сделки"
            options={dealTypeOptions}
            selectedValue={watch("deal_type")}
            onSelect={(value) => setValue("deal_type", value as DealType)}
          />

          {/* Тип недвижимости */}
          <SelectionCategory
            title="Тип недвижимости"
            options={propertyTypeOptionsSelect}
            selectedValue={watch("property_type")}
            onSelect={(value) =>
              setValue("property_type", value as PropertyType)
            }
          />

          {/* Вид недвижимости */}
          <div className="space-y-8">
            <div className="text-lg font-semibold">Вид недвижимости</div>
            <div className="grid grid-cols-3 gap-6">
              {filteredPropertyKinds.map((option) => (
                <div
                  key={option.value}
                  onClick={() =>
                    setValue("property_kind", option.value as PropertyKind)
                  }
                  className={`flex w-full max-w-64 cursor-pointer items-center justify-center space-x-2 rounded-xl border border-smooth bg-white px-8 py-5 ${
                    watch("property_kind") === option.value
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
            {errors.property_kind && (
              <p className="text-sm text-red-500">
                {errors.property_kind.message}
              </p>
            )}
          </div>

          {/* Местоположение на карте */}
          <div className="space-y-8">
            <div className="text-lg font-semibold">Местоположение на карте</div>
            <YandexMap
              onCoordinatesChange={handleCoordinatesChange}
              editable={true}
              height="500px"
              initialCoordinates={[watch("latitude"), watch("longitude")]}
            />
            {(errors.latitude || errors.longitude) && (
              <p className="text-sm text-red-500">Проверьте координаты</p>
            )}
          </div>
        </div>

        {/* Форма редактирования */}
        <form
          className="space-y-8 rounded-[20px] bg-white p-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Фотографии */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Фото</h2>
            <div className="mb-4 flex flex-wrap gap-4">
              {/* Существующие изображения */}
              {loadedImages.map((img, index) => (
                <div key={`loaded-${index}`} className="relative">
                  <Image
                    src={img}
                    alt={`Фото ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, false)}
                    className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded bg-transparent p-1 text-transparent transition-all duration-200 hover:bg-black/60 hover:text-white"
                  >
                    <XMarkIcon className="h-10 w-10" />
                  </button>
                </div>
              ))}
              {/* Новые изображения */}
              {newImages.map((img, index) => (
                <div key={`new-${index}`} className="relative">
                  <Image
                    src={img.base64}
                    alt={`Новое фото ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, true)}
                    className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded bg-transparent p-1 text-transparent transition-all duration-200 hover:bg-black/60 hover:text-white"
                  >
                    <XMarkIcon className="h-10 w-10" />
                  </button>
                </div>
              ))}
            </div>
            {/* Загрузка новых фотографий */}
            <div>
              <InputFileImage
                multiple={true}
                id="images"
                label=""
                onChange={handleFileChange}
                disabled={loadedImages.length + newImages.length >= 4}
              />
              {errors.images && (
                <p className="text-sm text-red-500">{errors.images.message}</p>
              )}
            </div>
          </div>

          {/* Расположение */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Расположение</h2>
            <h3 className="text-base font-semibold">Адрес</h3>
            <InputText
              id="address.region"
              label=""
              placeholder="Область"
              {...register("address.region")}
            />
            <InputText
              id="address.district"
              label=""
              placeholder="Район"
              {...register("address.district")}
            />
            <div className="flex space-x-2">
              <CustomSelect
                id="address.locality_type"
                options={localityOptions}
                placeholder="Тип населенного пункта"
                register={register}
                error={errors.address?.locality_type?.message}
              />
              <InputText
                id="address.locality"
                label=""
                placeholder="Населённый пункт"
                {...register("address.locality")}
              />
            </div>
            <div className="flex space-x-2">
              <CustomSelect
                id="address.street_type"
                options={streetOptions}
                placeholder="Тип улицы"
                register={register}
                error={errors.address?.street_type?.message}
              />
              <InputText
                id="address.street"
                label=""
                placeholder="Улица"
                {...register("address.street")}
              />
            </div>
            <InputText
              id="address.house"
              label=""
              placeholder="Дом"
              {...register("address.house")}
            />
            <InputText
              id="address.floor"
              label=""
              placeholder="Этаж"
              {...register("address.floor")}
            />
            <InputText
              id="address.corpus"
              label=""
              placeholder="Корпус"
              {...register("address.corpus")}
            />
          </div>

          {/* Дополнительная информация */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Доп. информация</h2>
            {watch("property_type") !== PropertyType.Commercial && (
              <>
                <h3 className="text-base font-semibold">Удобства</h3>
                <div className="space-y-4">
                  <InputCheckbox
                    width={24}
                    height={24}
                    className="text-sm"
                    id="amenities.internet"
                    label="Интернет"
                    {...register("amenities.internet")}
                  />
                  <InputCheckbox
                    width={24}
                    height={24}
                    className="text-sm"
                    id="amenities.elevator"
                    label="Лифт"
                    {...register("amenities.elevator")}
                  />
                  <InputCheckbox
                    width={24}
                    height={24}
                    className="text-sm"
                    id="amenities.conditioner"
                    label="Кондиционер"
                    {...register("amenities.conditioner")}
                  />
                  <InputCheckbox
                    width={24}
                    height={24}
                    className="text-sm"
                    id="amenities.heating"
                    label="Отопление"
                    {...register("amenities.heating")}
                  />
                  <InputCheckbox
                    width={24}
                    height={24}
                    className="text-sm"
                    id="amenities.parking"
                    label="Парковка"
                    {...register("amenities.parking")}
                  />
                  <InputCheckbox
                    width={24}
                    height={24}
                    className="text-sm"
                    id="amenities.furniture"
                    label="Мебель"
                    {...register("amenities.furniture")}
                  />
                  <InputCheckbox
                    width={24}
                    height={24}
                    className="text-sm"
                    id="amenities.watersupply"
                    label="Водоснабжение"
                    {...register("amenities.watersupply")}
                  />
                </div>
              </>
            )}
            <h3 className="text-base font-semibold">Характеристики</h3>
            <div className="space-y-4">
              <InputNumber
                id="characteristics.rooms"
                label=""
                placeholder="Количество комнат"
                {...register("characteristics.rooms", { valueAsNumber: true })}
              />
              <InputNumber
                allowDecimal={true}
                id="characteristics.total_area"
                label=""
                placeholder="Общая площадь"
                {...register("characteristics.total_area", {
                  valueAsNumber: true,
                })}
              />
              <InputNumber
                allowDecimal={true}
                id="characteristics.living_area"
                label=""
                placeholder="Жилая площадь"
                {...register("characteristics.living_area", {
                  valueAsNumber: true,
                })}
              />
              <InputNumber
                id="characteristics.year"
                label=""
                placeholder="Год"
                {...register("characteristics.year", { valueAsNumber: true })}
              />
              <CustomSelect
                id="characteristics.period"
                options={periodOptions}
                placeholder="Период"
                register={register}
                error={errors.characteristics?.period?.message}
              />
              <InputNumber
                id="characteristics.price"
                label=""
                placeholder={
                  watchDealType === DealType.Buy
                    ? "Введите стоимость"
                    : "Введите стоимость за месяц"
                }
                {...register("characteristics.price", { valueAsNumber: true })}
              />
              {watchDealType === DealType.Rent && (
                <InputCheckbox
                  className="text-sm"
                  id="characteristics.payment"
                  label="Предоплата"
                  {...register("characteristics.payment")}
                />
              )}
            </div>
          </div>

          {/* Описание */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Описание</h2>
            <InputTextarea
              label=""
              placeholder="Краткое описание привлекает больше внимания."
              id="description"
              {...register("description")}
            />
          </div>

          {/* Кнопки "Обновить данные" и "Отменить" */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue px-7 py-3.5 font-semibold text-white"
            >
              Обновить данные
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-xl bg-gray-200 px-7 py-3.5 font-semibold text-gray-700 hover:bg-gray-300"
            >
              Отменить
            </button>
          </div>

          {/* Общие ошибки формы */}
          {Object.keys(errors).length > 0 && (
            <div className="text-sm text-red-500">
              Проверьте корректность введённых данных
            </div>
          )}
        </form>
      </div>
    </>
  );
}
