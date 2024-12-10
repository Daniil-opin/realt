import { z } from "zod";
import {
  DealType,
  PropertyType,
  PropertyKind,
  LocalityType,
  StreetType,
  Period,
} from "@/app/lib/definitions";

export const registrationSchema = z
  .object({
    lastname: z.string().min(1, "Фамилия обязательна"),
    firstname: z.string().min(1, "Имя обязательно"),
    email: z.string().email("Введите корректный адрес электронной почты"),
    password: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .max(16, "Пароль должен быть не длиннее 16 символов")
      .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
      .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
      .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
    repeatPassword: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .max(16, "Пароль должен быть не длиннее 16 символов"),
    tel: z
      .string()
      .regex(/^\d{2} \d{3}-\d{2}-\d{2}$/, "Введите корректный номер телефона"),
    consent: z.literal(true, {
      errorMap: () => ({
        message: "Необходимо согласие на обработку персональных данных",
      }),
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Пароли не совпадают",
  });

export const updateSchema = z.object({
  last_name: z.string().min(1, "Фамилия обязательна"),
  first_name: z.string().min(1, "Имя обязательно"),
  email: z.string().email("Введите корректный адрес электронной почты"),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(16, "Пароль должен быть не длиннее 16 символов")
    .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
  tel: z
    .string()
    .regex(/^\d{2} \d{3}-\d{2}-\d{2}$/, "Введите корректный номер телефона"),
});

export const loginSchema = z.object({
  email: z.string().email("Введите корректный адрес электронной почты"),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(16, "Пароль должен быть не длиннее 16 символов")
    .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

export const formSchema = z.object({
  dealType: z.nativeEnum(DealType).default(DealType.Buy),
  propertyType: z.nativeEnum(PropertyType).default(PropertyType.Residential),
  propertyKind: z.nativeEnum(PropertyKind).default(PropertyKind.Apartment),
  coordinates: z.tuple([z.number(), z.number()]).default([53.9025, 27.5615]),
  address: z.object({
    region: z.string().default(""),
    district: z.string().default(""),
    localityType: z.nativeEnum(LocalityType).default(LocalityType.Village),
    locality: z.string().default(""),
    streetType: z.nativeEnum(StreetType).default(StreetType.Street),
    street: z.string().default(""),
    house: z.string().default(""),
    floor: z.string().default(""),
    corpus: z.string().default(""),
  }),
  amenities: z
    .object({
      internet: z.boolean().default(false),
      elevator: z.boolean().default(false),
      conditioner: z.boolean().default(false),
      heating: z.boolean().default(false),
      parking: z.boolean().default(false),
      furniture: z.boolean().default(false),
      watersupply: z.boolean().default(false),
    })
    .optional(),
  characteristics: z.object({
    rooms: z.string().default(""),
    totalArea: z.string().default(""),
    livingArea: z.string().default(""),
    year: z.string().default(""),
    period: z.nativeEnum(Period).default(Period.Long),
    price: z.string().default(""),
    payment: z.boolean().optional().default(false),
  }),
  description: z.string().default(""),
  images: z.array(z.string()).max(4).default([]),
});

export type FormData = z.infer<typeof formSchema>;
