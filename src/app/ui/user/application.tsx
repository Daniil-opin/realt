import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function UserApplication() {
  return (
    <div className="flex items-center justify-between space-x-4">
      <span className="text-lg font-semibold">#1</span>
      <Image
        src="/images/img2.png"
        width={80}
        height={80}
        alt="Недвижимость"
        className="h-11 w-11 rounded-xl object-cover object-center"
      />
      <span className="line-clamp-1 max-w-max flex-1 text-sm font-medium">
        ул. Петра Мстиславца, 12, оф. 34, Москва, Россия
      </span>
      <span className="text-sm font-medium">$4,550 / месяц</span>
      <ChevronRightIcon className="h-5 w-5 cursor-pointer" />
    </div>
  );
}
