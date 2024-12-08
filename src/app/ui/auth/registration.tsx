"use client";

import { z } from "zod";
import { registrationSchema } from "@/app/lib/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "../input/text";
import { InputEmail } from "../input/email";
import { InputPassword } from "../input/password";
import { InputTel } from "../input/tel";
import { InputCheckbox } from "../input/consent";
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
          <InputCheckbox
            placeholder=""
            id="consent"
            label="Даю согласие на обработку персональных данных"
            register={register("consent")}
            error={errors.consent?.message}
          />
        </div>
        <button className="mt-12 block h-14 w-full rounded-xl bg-blue text-center font-medium text-white">
          Зарегистрироваться
        </button>
      </form>
    </>
  );
}
