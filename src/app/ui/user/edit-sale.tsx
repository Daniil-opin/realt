"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BuildingOffice2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { convertFileToBase64, getProcessedSrc } from "@/app/lib/utils";
import {
  EstateRead,
  DealType,
  PropertyType,
  PropertyKind,
  LocalityType,
  StreetType,
  Period,
  EstateUpdate,
} from "@/app/lib/definitions";
import { getEstateById, updateEstate } from "@/app/seed/route";
import { useParams, useRouter } from "next/navigation";
import { InputFileImage } from "../input/file";
import { InputText } from "../input/text";
import CustomSelect from "../input/select";
import { InputCheckbox } from "../input/consent";
import { InputNumber } from "../input/number";
import InputTextarea from "../input/textarea";
import YandexMap from "../map/yandex";
import { toast } from "react-toastify";

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

// Обновлённая схема Zod с обязательными полями images_to_keep и images_to_add
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
  address: z.object({
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
  }),
  amenities: z.object({
    internet: z.boolean().optional(),
    elevator: z.boolean().optional(),
    conditioner: z.boolean().optional(),
    heating: z.boolean().optional(),
    parking: z.boolean().optional(),
    furniture: z.boolean().optional(),
    watersupply: z.boolean().optional(),
  }),
  characteristics: z.object({
    rooms: z.number().int().optional(),
    total_area: z.number().optional(),
    living_area: z.number().optional(),
    year: z.number().int().optional(),
    period: z.enum([Period.Long, Period.Short]).optional(),
    price: z.number().optional(),
    payment: z.boolean().optional(),
  }),
  images_to_keep: z.array(z.string()).default([]), // Обязательное поле с дефолтом
  images_to_add: z
    .array(
      z.object({
        image_base64: z.string(),
      }),
    )
    .default([]), // Обязательное поле с дефолтом
});

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

export default function EditEstatePage() {
  const params = useParams();
  const router = useRouter();
  const estateId = parseInt(params.id as string, 10);

  const [loadedImages, setLoadedImages] = useState<string[]>([]); // Существующие изображения
  const [imagesToKeep, setImagesToKeep] = useState<string[]>([]); // Изображения, которые будут сохранены
  const [imagesToAdd, setImagesToAdd] = useState<{ image_base64: string }[]>(
    [],
  ); // Новые изображения

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
    control,
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
      images_to_keep: [],
      images_to_add: [],
    },
  });

  // Watchers
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

  // Фетч данных недвижимости
  useEffect(() => {
    const fetchEstate = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.warning(
            "Вы должны войти в систему для редактирования недвижимости.",
          );
          router.back();
          return;
        }
        const data: EstateRead = await getEstateById(estateId);
        console.log(data);
        const existingImages = data.images.map((img) =>
          getProcessedSrc(img.image_url),
        );
        setLoadedImages(existingImages);
        setImagesToKeep(existingImages); // Изначально все существующие изображения сохраняем

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
          images_to_keep: existingImages, // Существующие изображения сохраняем
          images_to_add: [], // Новые изображения изначально пусты
        });
      } catch (error) {
        toast.error("Не удалось загрузить данные недвижимости.");
        console.error(error);
        router.back();
      }
    };
    if (estateId) {
      fetchEstate();
    }
  }, [estateId, reset, router]);

  // Отслеживание текущих значений чекбоксов и характеристик
  const amenities = watch("amenities");
  const characteristics = watch("characteristics");

  const handleCoordinatesChange = (coords: [number, number]) => {
    setValue("latitude", coords[0]);
    setValue("longitude", coords[1]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = watch("images_to_keep");
    const remainingSlots = 4 - currentImages.length - imagesToAdd.length;

    const filesArray = Array.from(files).slice(0, remainingSlots);

    const base64Promises = filesArray.map((file) => convertFileToBase64(file));

    try {
      const base64Images = await Promise.all(base64Promises);
      const newImagesData = base64Images.map((base64) => ({
        image_base64: base64.split(",")[1], // Удаление префикса
      }));
      setImagesToAdd((prev) => [...prev, ...newImagesData]);
      setValue("images_to_add", [...imagesToAdd, ...newImagesData]);
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
    }
  };

  // Обработка удаления изображений
  const handleRemoveImage = (index: number, isNew: boolean) => {
    if (isNew) {
      // Удаление нового изображения
      const updatedImagesToAdd = imagesToAdd.filter((_, i) => i !== index);
      setImagesToAdd(updatedImagesToAdd);
      setValue("images_to_add", updatedImagesToAdd);
    } else {
      // Удаление существующего изображения
      const updatedImagesToKeep = imagesToKeep.filter((_, i) => i !== index);
      setImagesToKeep(updatedImagesToKeep);
      setValue("images_to_keep", updatedImagesToKeep);
    }
  };

  // Обработка отправки формы
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Проверка количества фотографий
    const totalImages = data.images_to_keep.length + data.images_to_add.length;
    if (totalImages < 2) {
      toast.warning("Минимум 2 фотографии.");
      return;
    }
    if (totalImages > 4) {
      toast.warning("Максимум 4 фотографии.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warning("Вы должны войти в систему для обновления недвижимости.");
        return;
      }

      // Подготовка данных для обновления
      const estateUpdateData: EstateUpdate = {
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
        images_to_keep: data.images_to_keep,
        images_to_add: data.images_to_add,
      };

      console.log("Новые данные:", estateUpdateData); // Для отладки

      // Отправка данных на сервер
      await updateEstate(estateId, estateUpdateData, token);
      toast.success("Данные успешно обновлены!");
      router.back();
    } catch (error: any) {
      toast.error(
        `Ошибка при обновлении недвижимости: ${error.message || error}`,
      );
    }
  };

  // Обработка отмены редактирования
  const handleCancel = () => {
    router.back();
  };

  // Отладка: Отслеживание изменений в форме
  useEffect(() => {
    const subscription = watch((value) => {
      console.log("Текущие значения формы:", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      {/* Условный рендеринг DevTool только в режиме разработки */}
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
          <Controller
            control={control}
            name="images_to_keep"
            render={({ field }) => (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold">Фото</h2>
                <div className="mb-4 flex flex-wrap gap-4">
                  {/* Отображение существующих изображений */}
                  {field.value.map((img, index) => (
                    <div key={`existing-image-${index}`} className="relative">
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

                  {/* Отображение новых добавленных изображений */}
                  {imagesToAdd.map((img, index) => (
                    <div key={`new-image-${index}`} className="relative">
                      <Image
                        src={`data:image/*;base64,${img.image_base64}`}
                        alt={`Новое фото ${index + 1}`}
                        width={100}
                        height={100}
                        className="h-24 w-24 rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index, true)}
                        className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {/* Загрузка новых фотографий */}
                <InputFileImage
                  multiple={true}
                  id="images"
                  label=""
                  onChange={handleFileChange}
                  disabled={field.value.length + imagesToAdd.length >= 4}
                />
                {(errors.images_to_keep || errors.images_to_add) && (
                  <p className="text-sm text-red-500">
                    {errors.images_to_keep?.message ||
                      errors.images_to_add?.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Расположение */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Расположение</h2>
            <h3 className="text-base font-semibold">Адрес</h3>
            <InputText
              id="address.region"
              label=""
              placeholder="Область"
              {...register("address.region")}
              error={errors.address?.region?.message}
            />
            <InputText
              id="address.district"
              label=""
              placeholder="Район"
              {...register("address.district")}
              error={errors.address?.district?.message}
            />
            <div className="flex space-x-2">
              <CustomSelect
                classNameSelect="max-w-24"
                id="address.locality_type"
                options={localityOptions}
                placeholder="Тип населенного пункта"
                {...register("address.locality_type")}
                error={errors.address?.locality_type?.message}
              />
              <InputText
                id="address.locality"
                label=""
                placeholder="Населённый пункт"
                {...register("address.locality")}
                error={errors.address?.locality?.message}
              />
            </div>
            <div className="flex space-x-2">
              <CustomSelect
                classNameSelect="max-w-24"
                id="address.street_type"
                options={streetOptions}
                placeholder="Тип улицы"
                {...register("address.street_type")}
                error={errors.address?.street_type?.message}
              />
              <InputText
                id="address.street"
                label=""
                placeholder="Улица"
                {...register("address.street")}
                error={errors.address?.street?.message}
              />
            </div>
            <InputText
              id="address.house"
              label=""
              placeholder="Дом"
              {...register("address.house")}
              error={errors.address?.house?.message}
            />
            <InputText
              id="address.floor"
              label=""
              placeholder="Этаж"
              {...register("address.floor")}
              error={errors.address?.floor?.message}
            />
            <InputText
              id="address.corpus"
              label=""
              placeholder="Корпус"
              {...register("address.corpus")}
              error={errors.address?.corpus?.message}
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
                    id="amenities.internet"
                    label="Интернет"
                    checked={amenities.internet || false}
                    onChange={(e) =>
                      setValue("amenities.internet", e.target.checked)
                    }
                    error={errors.amenities?.internet?.message}
                  />
                  <InputCheckbox
                    id="amenities.elevator"
                    label="Лифт"
                    checked={amenities.elevator || false}
                    onChange={(e) =>
                      setValue("amenities.elevator", e.target.checked)
                    }
                    error={errors.amenities?.elevator?.message}
                  />
                  <InputCheckbox
                    id="amenities.conditioner"
                    label="Кондиционер"
                    checked={amenities.conditioner || false}
                    onChange={(e) =>
                      setValue("amenities.conditioner", e.target.checked)
                    }
                    error={errors.amenities?.conditioner?.message}
                  />
                  <InputCheckbox
                    id="amenities.heating"
                    label="Отопление"
                    checked={amenities.heating || false}
                    onChange={(e) =>
                      setValue("amenities.heating", e.target.checked)
                    }
                    error={errors.amenities?.heating?.message}
                  />
                  <InputCheckbox
                    id="amenities.parking"
                    label="Парковка"
                    checked={amenities.parking || false}
                    onChange={(e) =>
                      setValue("amenities.parking", e.target.checked)
                    }
                    error={errors.amenities?.parking?.message}
                  />
                  <InputCheckbox
                    id="amenities.furniture"
                    label="Мебель"
                    checked={amenities.furniture || false}
                    onChange={(e) =>
                      setValue("amenities.furniture", e.target.checked)
                    }
                    error={errors.amenities?.furniture?.message}
                  />
                  <InputCheckbox
                    id="amenities.watersupply"
                    label="Водоснабжение"
                    checked={amenities.watersupply || false}
                    onChange={(e) =>
                      setValue("amenities.watersupply", e.target.checked)
                    }
                    error={errors.amenities?.watersupply?.message}
                  />
                </div>
              </>
            )}
            <h3 className="text-base font-semibold">Характеристики</h3>
            <div className="space-y-4">
              {/* Используем Controller для InputNumber */}
              <Controller
                control={control}
                name="characteristics.rooms"
                render={({ field }) => (
                  <InputNumber
                    id="characteristics.rooms"
                    label="Количество комнат"
                    placeholder="Введите количество комнат"
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(value: string) => {
                      const numberValue = Number(value);
                      if (!isNaN(numberValue)) {
                        field.onChange(numberValue);
                      }
                    }}
                    error={errors.characteristics?.rooms?.message}
                    allowDecimal={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="characteristics.total_area"
                render={({ field }) => (
                  <InputNumber
                    id="characteristics.total_area"
                    label="Общая площадь"
                    placeholder="Введите общую площадь"
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(value: string) => {
                      const numberValue = Number(value);
                      if (!isNaN(numberValue)) {
                        field.onChange(numberValue);
                      }
                    }}
                    error={errors.characteristics?.total_area?.message}
                    allowDecimal={true}
                  />
                )}
              />

              <Controller
                control={control}
                name="characteristics.living_area"
                render={({ field }) => (
                  <InputNumber
                    id="characteristics.living_area"
                    label="Жилая площадь"
                    placeholder="Введите жилую площадь"
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(value: string) => {
                      const numberValue = Number(value);
                      if (!isNaN(numberValue)) {
                        field.onChange(numberValue);
                      }
                    }}
                    error={errors.characteristics?.living_area?.message}
                    allowDecimal={true}
                  />
                )}
              />

              <Controller
                control={control}
                name="characteristics.year"
                render={({ field }) => (
                  <InputNumber
                    id="characteristics.year"
                    label="Год"
                    placeholder="Введите год"
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(value: string) => {
                      const numberValue = Number(value);
                      if (!isNaN(numberValue)) {
                        field.onChange(numberValue);
                      }
                    }}
                    error={errors.characteristics?.year?.message}
                    allowDecimal={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="characteristics.period"
                render={({ field }) => (
                  <CustomSelect
                    id="characteristics.period"
                    options={periodOptions}
                    placeholder="Период"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    error={errors.characteristics?.period?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="characteristics.price"
                render={({ field }) => (
                  <InputNumber
                    id="characteristics.price"
                    label="Цена"
                    placeholder={
                      watchDealType === DealType.Buy
                        ? "Введите стоимость"
                        : "Введите стоимость за месяц"
                    }
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(value: string) => {
                      const numberValue = Number(value);
                      if (!isNaN(numberValue)) {
                        field.onChange(numberValue);
                      }
                    }}
                    error={errors.characteristics?.price?.message}
                    allowDecimal={true}
                  />
                )}
              />

              {watchDealType === DealType.Rent && (
                <InputCheckbox
                  id="characteristics.payment"
                  label="Предоплата"
                  checked={characteristics.payment || false}
                  onChange={(e) =>
                    setValue("characteristics.payment", e.target.checked)
                  }
                  error={errors.characteristics?.payment?.message}
                />
              )}
            </div>
          </div>

          {/* Описание */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Описание</h2>
            <InputTextarea
              id="description"
              label=""
              placeholder="Краткое описание привлекает больше внимания."
              {...register("description")}
              error={errors.description?.message}
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
