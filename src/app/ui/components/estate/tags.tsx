import { CharacteristicRead } from "@/app/lib/definitions";

export default function EstateTags({
  characteristics,
}: {
  characteristics: CharacteristicRead;
}) {
  return (
    <div className="mb-14 flex items-start justify-start space-x-5 lg:space-x-10">
      <div className="flex flex-col items-start justify-start space-y-2">
        <span className="font-semibold leading-none text-greyblue">
          Общая площадь
        </span>
        <span className="text-2xl font-semibold leading-none">
          {characteristics.total_area} м²
        </span>
      </div>

      <div className="mx-4 min-h-10 w-0.5 bg-smooth"></div>

      <div className="flex flex-col items-start justify-start space-y-2">
        <span className="font-semibold leading-none text-greyblue">
          Жилая площадь
        </span>
        <span className="text-2xl font-semibold leading-none">
          {characteristics.living_area} м²
        </span>
      </div>

      <div className="mx-4 min-h-10 w-0.5 bg-smooth"></div>

      <div className="flex flex-col items-start justify-start space-y-2">
        <span className="font-semibold leading-none text-greyblue">
          Год постройки
        </span>
        <span className="text-2xl font-semibold leading-none">
          {characteristics.year}
        </span>
      </div>
    </div>
  );
}
