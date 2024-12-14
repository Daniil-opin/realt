import { UseFormRegisterReturn } from "react-hook-form";

export type Deal = "buy" | "rent";

export interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  error?: string;
}

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name?: string;
  id: string;
  label: string;
  error?: string;
}

export enum DealType {
  Buy = "buy",
  Rent = "rent",
}

export enum UserRole {
  User = "user",
  Admin = "admin",
}

export enum PropertyType {
  Residential = "residential",
  Commercial = "commercial",
}

export enum PropertyKind {
  Apartment = "apartment",
  Room = "room",
  House = "house",
  Office = "office",
  Garage = "garage",
  Warehouse = "warehouse",
}

export enum LocalityType {
  Village = "village",
  Town = "town",
  Agrotown = "agrotown",
}

export enum StreetType {
  Street = "street",
  Avenue = "avenue",
  Alley = "alley",
  Boulevard = "boulevard",
}

export enum Period {
  Long = "long",
  Short = "short",
}

export enum Status {
  Await = "await",
  Resolve = "allowed",
  Reject = "forbidden",
}

export const StatusLabels: Record<Status, string> = {
  [Status.Await]: "Ожидает",
  [Status.Resolve]: "Одобрен",
  [Status.Reject]: "Отменён",
};

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: "Администратор",
  [UserRole.User]: "Пользователь",
};

// types/estate.ts

export interface EstateImageRead {
  id: number;
  estate_id: number;
  image_url: string;
}

export interface AddressRead {
  id: number;
  estate_id: number;
  region?: string;
  district?: string;
  locality_type?: LocalityType;
  locality?: string;
  street_type?: StreetType;
  street?: string;
  house?: string;
  floor?: string;
  corpus?: string;
}

export interface AmenityRead {
  id: number;
  estate_id: number;
  internet: boolean;
  elevator: boolean;
  conditioner: boolean;
  heating: boolean;
  parking: boolean;
  furniture: boolean;
  watersupply: boolean;
}

export interface CharacteristicRead {
  id: number;
  estate_id: number;
  rooms?: number;
  total_area?: number;
  living_area?: number;
  year?: number;
  period?: string;
  price?: number;
  payment?: boolean | null;
}

export interface EstateOwner {
  last_name: string;
  first_name: string;
  tel?: string;
}

export interface EstateRead {
  id: number;
  deal_type: string;
  property_type: PropertyType;
  property_kind: PropertyKind;
  latitude: number;
  longitude: number;
  description?: string;
  status: Status;
  created_at: string;
  updated_at: string;
  owner: EstateOwner;
  address?: AddressRead;
  amenities?: AmenityRead;
  characteristics?: CharacteristicRead;
  images: EstateImageRead[];
}

export interface EstateImageCreate {
  image_base64: string;
}

export interface AddressCreate {
  region?: string;
  district?: string;
  locality_type?: string;
  locality?: string;
  street_type?: string;
  street?: string;
  house?: string;
  floor?: string;
  corpus?: string;
}

export interface AmenityCreate {
  internet?: boolean;
  elevator?: boolean;
  conditioner?: boolean;
  heating?: boolean;
  parking?: boolean;
  furniture?: boolean;
  watersupply?: boolean;
}

export interface CharacteristicCreate {
  rooms?: number;
  total_area?: number;
  living_area?: number;
  year?: number;
  period?: string;
  price?: number;
  payment?: boolean;
}

export interface EstateCreate {
  deal_type: string;
  property_type: string;
  property_kind: string;
  latitude: number;
  longitude: number;
  description?: string;
  address?: AddressCreate;
  amenities?: AmenityCreate;
  characteristics?: CharacteristicCreate;
  images?: EstateImageCreate[];
}

export interface EstateUpdate {
  deal_type?: string;
  property_type?: string;
  property_kind?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  address?: AddressCreate;
  amenities?: AmenityCreate;
  characteristics?: CharacteristicCreate;
  images_to_keep: string[];
  images_to_add: EstateImageCreate[];
}

export const DealTypeLabels: Record<DealType, string> = {
  [DealType.Buy]: "Покупка",
  [DealType.Rent]: "Аренда",
};

export const PropertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.Residential]: "Жилая",
  [PropertyType.Commercial]: "Коммерческая",
};

export const PropertyKindLabels: Record<PropertyKind, string> = {
  [PropertyKind.Apartment]: "Квартира",
  [PropertyKind.Room]: "Комната",
  [PropertyKind.House]: "Дом",
  [PropertyKind.Office]: "Офис",
  [PropertyKind.Garage]: "Гараж",
  [PropertyKind.Warehouse]: "Склад",
};

export const PeriodLabels: Record<Period, string> = {
  [Period.Long]: "Длительный",
  [Period.Short]: "Кратковременный",
};

export const LocalityTypeLabels: Record<LocalityType, string> = {
  [LocalityType.Village]: "д.",
  [LocalityType.Town]: "г.",
  [LocalityType.Agrotown]: "аг.",
};

export const StreetTypeLabels: Record<StreetType, string> = {
  [StreetType.Street]: "ул.",
  [StreetType.Avenue]: "пр.",
  [StreetType.Alley]: "пер.",
  [StreetType.Boulevard]: "бул.",
};
