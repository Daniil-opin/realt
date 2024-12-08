export default function EstateTags() {
  return (
    <div className="mb-14 flex items-start justify-start space-x-5 lg:space-x-10">
      <div className="flex flex-col items-start justify-start space-y-2">
        <span className="font-semibold leading-none text-greyblue">
          Общая площадь
        </span>
        <span className="text-2xl font-semibold leading-none">34,4 м²</span>
      </div>

      <div className="mx-4 min-h-10 w-0.5 bg-smooth"></div>

      <div className="flex flex-col items-start justify-start space-y-2">
        <span className="font-semibold leading-none text-greyblue">
          Жилая площадь
        </span>
        <span className="text-2xl font-semibold leading-none">29,2 м²</span>
      </div>

      <div className="mx-4 min-h-10 w-0.5 bg-smooth"></div>

      <div className="flex flex-col items-start justify-start space-y-2">
        <span className="font-semibold leading-none text-greyblue">Этаж</span>
        <span className="text-2xl font-semibold leading-none">2</span>
      </div>
    </div>
  );
}
