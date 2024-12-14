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
import { updateUser } from "@/app/seed/route";
import { toast } from "react-toastify";

type UpdateFormData = z.infer<typeof updateSchema>;

export default function UserProfile() {
  const { user, isLoading } = useContext(AuthContext);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
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
    console.log(data);
    if (token) {
      try {
        await updateUser(token, data);
        setValue("password", "");
        toast.success("Данные успешно изменены");
      } catch (error) {
        toast.error(`Не удалось обновить данные: ${error}`);
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
          <div className="mb-32">
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
                  label="Пароль"
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
          </div>
        </>
      )}
    </>
  );
}
