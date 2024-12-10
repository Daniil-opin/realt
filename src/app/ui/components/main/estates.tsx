"use client";

import { useEffect, useState } from "react";
import { BuyIconMain, KeyIconMain } from "../../icons/icons";
import { EstateRead } from "@/app/lib/definitions";
import { getAllEstates } from "@/app/seed/route";
import EstateTable from "../../table/estate";
import EstateCard from "../../card/estate";

export default function Estate() {
  const [estates, setEstates] = useState<EstateRead[]>();
  const [service, setService] = useState<"rent" | "buy">("rent");

  useEffect(() => {
    const fetchEstates = async () => {
      const data = await getAllEstates();
      setEstates(data);
    };

    fetchEstates();
  }, [service]);

  return (
    <div className="w-full bg-lightblue">
      <div className="container pt-24">
        <h2 className="mb-4 text-3xl font-semibold">
          Новые объекты недвижимости
        </h2>
        <p className="mb-10 text-base">
          Некоторые из отобранных нами объектов недвижимости находятся рядом с
          вами.
        </p>
        <div className="mb-20 flex w-max items-center justify-start rounded-xl border-[1px] border-greyblue p-1 font-semibold">
          <div
            onClick={() => setService("rent")}
            className={`flex cursor-pointer items-center justify-start space-x-2 rounded-xl px-8 py-4 ${service === "rent" ? "bg-white text-blue" : "bg-transparent text-greyblue"}`}
          >
            <KeyIconMain fill={service === "rent" ? "#2f6feb" : "#959fb3"} />
            <span>Аренда</span>
          </div>
          <div
            onClick={() => setService("buy")}
            className={`flex cursor-pointer items-center justify-start space-x-2 rounded-xl px-8 py-4 ${service === "buy" ? "bg-white text-blue" : "bg-transparent text-greyblue"}`}
          >
            <BuyIconMain fill={service === "buy" ? "#2f6feb" : "#959fb3"} />
            <span>Купля</span>
          </div>
        </div>
        <EstateTable>
          {estates
            ?.slice(0, 8)
            ?.filter((estate) => estate.deal_type === service)
            .map((estate) => <EstateCard key={estate.id} estate={estate} />)}
        </EstateTable>
      </div>
    </div>
  );
}
