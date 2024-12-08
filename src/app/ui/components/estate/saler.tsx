"use client";

import { useState } from "react";

export default function EstateSaler() {
  const [isTelOpen, setIsTelOpen] = useState<boolean>(false);

  return (
    <div className="my-10 w-full rounded-[20px] bg-white p-10 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.05)] md:m-0">
      <h6 className="mb-5 flex items-center justify-start space-x-1 text-blue">
        <span className="text-3xl font-semibold">$4,550</span>
        <span className="text-xl font-medium">/ месяц</span>
      </h6>
      <div className="space-y-3">
        <h6 className="text-lg font-medium leading-none">Виктория Ольхович</h6>
        <h6
          onClick={
            isTelOpen
              ? () =>
                  window.open(
                    `tel:${"29 241-75-81".replace(/\s+/g, "")}`,
                    "_self",
                  )
              : () => {}
          }
          className={`${isTelOpen ? "cursor-pointer" : "cursor-auto"} text-lg font-medium leading-none`}
        >
          {`+375 ${isTelOpen ? "29 241-75-81" : "XX XXX-XX-XX"}`}
        </h6>
      </div>
      <button
        onClick={() => setIsTelOpen(true)}
        className="mt-8 w-full rounded-xl bg-blue px-7 py-3.5 font-semibold text-white"
      >
        Позвонить владельцу
      </button>
    </div>
  );
}
