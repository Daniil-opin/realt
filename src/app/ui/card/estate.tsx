import Image from "next/image";
import { HeartIcon } from "../icons/icons";

export default function EstateCard() {
  return (
    <div className="relative space-y-6 rounded-[20px] bg-white">
      <div>
        <Image
          src={"/images/img2.png"}
          className="rounded-t-[20px]"
          width={800}
          height={800}
          alt=""
        />
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
      </div>
      <div className="px-7 pb-8">
        <div className="mb-3 flex w-full items-center justify-between">
          <div className="flex w-max items-center justify-start rounded-xl bg-blue px-2 py-[6px] text-white">
            <span className="mr-1 text-2xl font-semibold uppercase">
              $4,550
            </span>
            <span> / месяц</span>
          </div>
          <div className="flex items-center justify-center rounded-full p-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.05)]">
            <HeartIcon fill="none" color="#2f6feb" />
          </div>
        </div>
        <p className="mb-6 text-sm leading-[1.5] text-black/70">
          ул. Западная, 17, д. Валерьяново, Минский район, Минская область,
          Беларусь
        </p>
        <button className="duration- w-full rounded-xl border-[1px] border-black py-3 text-sm font-semibold text-black/70 transition-all hover:border-blue hover:bg-blue hover:text-white">
          Подробнее
        </button>
      </div>
    </div>
  );
}
