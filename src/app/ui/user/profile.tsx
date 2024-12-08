"use client";

import { useContext, useEffect } from "react";
import { InputEmail } from "../input/email";
import { InputPassword } from "../input/password";
import { InputTel } from "../input/tel";
import { InputText } from "../input/text";
import { AuthContext } from "../context/auth";
import { Spinner } from "../icons/icons";
import { z } from "zod";
import { updateSchema } from "@/app/lib/action";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUser, updateUser } from "@/app/seed/route";
import UserApplication from "./application";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

type UpdateFormData = z.infer<typeof updateSchema>;

export default function UserProfile() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    register,
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      email: user?.email || "",
      last_name: user?.last_name || "",
      first_name: user?.first_name || "",
      tel: user?.tel || "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("email", user.email || "");
      setValue("last_name", user.last_name || "");
      setValue("first_name", user.first_name || "");
      setValue("tel", user.tel || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: UpdateFormData) => {
    const token = localStorage.getItem("token");

    const payload: UpdateUser = {
      ...data,
      role_id: user?.role.id || 3,
      consent: true,
    };

    if (token) {
      try {
        await updateUser(token, payload);
        reset();
      } catch (error) {
        console.error("Не удалось обновить данные!", error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex min-h-full items-center justify-center">
          <Spinner width="w-12" height="h-12" />
        </div>
      ) : (
        <>
          <h1 className="my-12 text-3xl font-semibold text-black">
            Персональная информация
          </h1>
          <div className="mb-32 grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-[3fr_2fr] 2xl:grid-cols-[2fr_1fr]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-[20px] bg-white p-10"
            >
              <div className="space-y-3">
                <InputEmail
                  id="email"
                  label="Почта"
                  placeholder="Ваша почта"
                  register={register("email")}
                  error={errors.email?.message}
                />
                <InputText
                  id="last_name"
                  label="Фамилия"
                  placeholder="Ваша фамилия"
                  register={register("last_name")}
                  error={errors.last_name?.message}
                />
                <InputText
                  id="first_name"
                  label="Имя"
                  placeholder="Ваше имя"
                  register={register("first_name")}
                  error={errors.first_name?.message}
                />
                <Controller
                  control={control}
                  name="tel"
                  render={({ field: { onChange, value } }) => (
                    <InputTel
                      id="tel"
                      label="Контактный телефон"
                      placeholder="00 000 00 00"
                      value={value}
                      onChange={onChange}
                      error={errors.tel?.message}
                    />
                  )}
                />
                <InputPassword
                  id="password"
                  label="Подтвердите изменения"
                  placeholder="Ваш пароль"
                  register={register("password")}
                  error={errors.password?.message}
                />
              </div>
              <button
                type="submit"
                className="mt-10 w-full rounded-xl bg-blue p-3.5 px-7 font-semibold text-white"
              >
                Сохранить
              </button>
            </form>
            <div className="h-full w-full space-y-5 rounded-[20px] bg-white p-10">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-xl font-semibold">Ваши объявления</h2>
                <ChevronDoubleRightIcon
                  onClick={() => router.push("/user/estates")}
                  className="h-5 w-5 cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-1 gap-y-3">
                <UserApplication />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
