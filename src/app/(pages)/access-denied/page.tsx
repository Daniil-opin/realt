"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const AccessDenied: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleGoBack();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="mb-4 flex flex-col items-center">
        <h1 className="text-[120px] font-bold leading-[1.2] text-red-600 md:text-[250px] lg:text-[300px]">
          403
        </h1>
        <p className="mb-6 text-sm font-medium lg:text-lg">
          У вас нет прав доступа к этой странице. Вы будете перенаправлены назад
          через{" "}
          <span className="text-base font-semibold lg:text-xl">5 секунд</span>.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
