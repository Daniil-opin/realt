"use client";

import { z } from "zod";
import { registrationSchema } from "@/app/lib/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "../input/text";
import { InputEmail } from "../input/email";
import { InputPassword } from "../input/password";
import { InputTel } from "../input/tel";
import { registerUser, RegisterUser } from "@/app/seed/route";
import { useContext } from "react";
import { AuthContext } from "../context/auth";

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function Registration() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      lastname: "",
      firstname: "",
      email: "",
      password: "",
      repeatPassword: "",
      tel: "",
      consent: true,
    },
  });

  const { login } = useContext(AuthContext);

  const onSubmit = async (data: RegistrationFormData) => {
    const payload: RegisterUser = {
      last_name: data.lastname,
      first_name: data.firstname,
      email: data.email,
      tel: data.tel,
      password: data.password,
      consent: data.consent,
    };

    try {
      const res = await registerUser(payload);
      login(res.token);
    } catch (error) {
      console.error("Не удалось зарегистрироваться", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
        <div className="space-y-2">
          <InputText
            id="lastname"
            label="Фамилия"
            placeholder="Ваша фамилия"
            register={register("lastname")}
            error={errors.lastname?.message}
          />
          <InputText
            id="firstname"
            label="Имя"
            placeholder="Ваше имя"
            register={register("firstname")}
            error={errors.firstname?.message}
          />
          <InputEmail
            id="email"
            label="Почта"
            placeholder="Ваша почта"
            register={register("email")}
            error={errors.email?.message}
          />
          <InputPassword
            id="password"
            label="Пароль"
            placeholder="Ваш пароль"
            register={register("password")}
            error={errors.password?.message}
          />
          <InputPassword
            id="repeatPassword"
            label="Подтвердите пароль"
            placeholder="Пароль"
            register={register("repeatPassword")}
            error={errors.repeatPassword?.message}
          />
          <Controller
            control={control}
            name="tel"
            render={({ field: { onChange, value } }) => (
              <InputTel
                id="tel"
                label="Контактный телефон"
                placeholder="00 000 00 00"
                value={value || ""}
                onChange={onChange}
                error={errors.tel?.message}
              />
            )}
          />
          <div className="flex cursor-pointer flex-col items-center">
            <label className="flex w-full cursor-pointer items-center">
              <input
                id="consent"
                type="checkbox"
                className="peer sr-only absolute h-0 w-0 opacity-0"
                {...register("consent")}
              />
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md border-[1px] border-greyblue text-sm text-white peer-checked:border-blue peer-checked:text-blue ${
                  errors.consent ? "border-red-500" : "border-smooth"
                }`}
              >
                <svg
                  className="flex items-center justify-center"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15.7069 6.29279C15.5192 6.10532 15.2646 6 14.9992 6C14.7337 6 14.4792 6.10532 14.2914 6.29279L7.99187 12.5858L5.69648 10.2928C5.50768 10.1106 5.25481 10.0098 4.99234 10.0121C4.72987 10.0144 4.4788 10.1196 4.2932 10.305C4.1076 10.4904 4.00232 10.7412 4.00004 11.0034C3.99776 11.2656 4.09866 11.5182 4.281 11.7068L7.28413 14.7068C7.47186 14.8943 7.72643 14.9996 7.99187 14.9996C8.25731 14.9996 8.51188 14.8943 8.69961 14.7068L15.7069 7.70679C15.8946 7.51926 16 7.26495 16 6.99979C16 6.73462 15.8946 6.48031 15.7069 6.29279Z" />
                </svg>
              </span>
              <span className="ml-2 text-sm text-black">
                Даю согласие на обработку персональных данных
              </span>
            </label>
            {errors.consent?.message && (
              <p className="mt-1 block text-xs text-red-500">
                {errors.consent?.message}
              </p>
            )}
          </div>
        </div>
        <button className="mt-12 block h-14 w-full rounded-xl bg-blue text-center font-medium text-white">
          Зарегистрироваться
        </button>
      </form>
    </>
  );
}
