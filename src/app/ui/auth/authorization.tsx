"use client";

import { loginSchema } from "@/app/lib/action";
import { z } from "zod";
import { InputEmail } from "../input/email";
import { InputPassword } from "../input/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../context/auth";
import { loginUser } from "@/app/seed/route";

type LoginFormData = z.infer<typeof loginSchema>;

export default function Authorization() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const { login } = useContext(AuthContext);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginUser(data);
      login(res.token);
    } catch (error) {
      console.error("Не удалось зарегистрироваться", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
        <div className="space-y-3">
          <InputEmail
            register={register("email")}
            error={errors.email?.message}
            id="email"
            label="Почта"
            placeholder="Ваша почта"
          />
          <InputPassword
            id="password"
            label="Пароль"
            placeholder="Ваш пароль"
            register={register("password")}
            error={errors.password?.message}
          />
        </div>
        <button className="mt-12 block h-14 w-full rounded-xl bg-blue text-center font-medium text-white">
          Войти
        </button>
      </form>
    </>
  );
}
