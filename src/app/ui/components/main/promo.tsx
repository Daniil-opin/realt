"use client";

import { searchCategory } from "@/app/lib/placeholder-data";
import Image from "next/image";
import { useState } from "react";

export default function Promo() {
  const [service, setService] = useState<"rent" | "buy">("rent");

  return (
    <div className="relative h-max w-full overflow-hidden">
      <Image
        src={"/images/mainScreen.jpg"}
        alt={"Главный экран"}
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        quality={100}
        priority
        className="absolute z-0 h-auto w-full max-w-full"
      />
      <div className="relative z-10 space-y-10 py-32 text-white">
        <div className="container space-y-10">
          <div className="w-max space-y-6 rounded-[30px] bg-white p-10 text-foreground">
            <h2 className="text-6xl font-bold leading-[1.35]">
              Легко покупайте, сдавайте
              <br />в аренду или продавайте
              <br /> свою недвижимость
            </h2>
            <p className="w-full text-xl font-medium">
              Отличная платформа для покупки, продажи или сдачи в аренду вашей
              недвижимости <br />
              без каких-либо комиссий.
            </p>
          </div>
          <div>
            <div className="grid w-max grid-cols-2 rounded-t-[20px] bg-white font-semibold text-black">
              <div
                onClick={() => setService("rent")}
                className={`cursor-pointer border-b-2 px-8 py-4 ${
                  service === "rent"
                    ? "border-blue text-blue"
                    : "border-smoothblue"
                }`}
              >
                Аренда
              </div>
              <div
                onClick={() => setService("buy")}
                className={`cursor-pointer border-b-2 px-8 py-4 ${
                  service === "buy"
                    ? "border-blue text-blue"
                    : "border-smoothblue"
                }`}
              >
                Купля
              </div>
            </div>
            <div className="flex w-max items-center justify-start rounded-b-[20px] rounded-r-[20px] bg-white p-10 font-semibold">
              {searchCategory.map(({ title, subtitle, src }, idx, arr) => (
                <div
                  key={title}
                  className={`space-y-1 ${
                    idx !== arr.length - 1
                      ? "border-r-[1px] border-greyblue pr-9"
                      : "px-9"
                  }`}
                >
                  <h6 className="text-greyblue">{title}</h6>
                  <div className="flex items-center justify-start space-x-2 text-lg text-black">
                    <h5>{subtitle}</h5>
                    <Image
                      width={16}
                      height={16}
                      src={src}
                      alt="Местоположение"
                    />
                  </div>
                </div>
              ))}
              <button className="rounded-xl bg-blue px-7 py-4">Поиск</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
