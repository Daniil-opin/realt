"use client";

import { useState } from "react";
import { AuthorizationStages } from "@/app/lib/placeholder-data";
import Authorization from "@/app/ui/auth/authorization";
import Registration from "@/app/ui/auth/registration";
import Logo from "@/app/ui/logo/logo";

export default function AuthorizationPage() {
  const [stage, setStage] = useState("authorization");
  const content =
    stage === "authorization" ? <Authorization /> : <Registration />;

  return (
    <div className="flex min-h-dvh min-w-full items-center justify-center bg-white">
      <div className="flex w-full max-w-[410px] flex-col items-start justify-start rounded-2xl px-7 py-12 shadow-2xl">
        <Logo />
        <div className="mb-12 mt-5 flex h-10 w-full items-center justify-between rounded-xl bg-smooth p-0.5">
          {AuthorizationStages.map(({ title, id }) => (
            <div
              id={id}
              key={id}
              className={`flex h-full w-[calc(50%-2.5px)] items-center justify-center rounded-xl text-sm ${
                stage === id ? "bg-blue text-white" : ""
              }`}
            >
              <button
                onClick={() => setStage(id)}
                className="h-full w-full font-medium"
              >
                {title}
              </button>
            </div>
          ))}
        </div>
        {content}
      </div>
    </div>
  );
}
