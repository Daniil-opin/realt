export type EngService = "rent" | "buy" | "sale";

export type RusService = "Аренда" | "Купля" | "Продажа";

export const engToRus: Record<EngService, RusService> = {
  rent: "Аренда",
  buy: "Купля",
  sale: "Продажа",
};

export const rusToEng: Record<RusService, EngService> = {
  Аренда: "rent",
  Купля: "buy",
  Продажа: "sale",
};

export const searchCategory = [
  {
    title: "Местоположение",
    subtitle: "Минск, Беларусь",
    src: "/icons/iconMap.svg",
  },
  {
    title: "Тип",
    subtitle: "Тип объекта",
    src: "/icons/iconPlusHouse.svg",
  },
];

export const AuthorizationStages = [
  { title: "Авторизация", id: "authorization" },
  { title: "Регистрация", id: "registration" },
];
