import axios, { AxiosError } from "axios";
import { EstateCreate, EstateRead, EstateUpdate } from "../lib/definitions";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface UserRole {
  id: number;
  name: string;
}

export interface UserReadExtended {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel?: string;
  role: UserRole;
  consent: boolean;
}

export interface LoginResponse extends UserReadExtended {
  token: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  password: string;
  consent: boolean;
}

// Данные для обновления пользователя (не включаем role_id и consent, так как их нельзя менять)
export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  tel?: string;
  password?: string;
}

export interface UserBlockUnblock {
  consent: boolean;
}

export interface FilterParams {
  deal_type?: string;
  property_type?: string;
  property_kind?: string;
  min_price?: number;
  max_price?: number;
  area_range?: string;
  sort?: string;
  search_query?: string;
}

export const getAuthHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const handleAxiosError = (
  error: AxiosError | unknown,
  defaultMessage: string,
): never => {
  if (axios.isAxiosError(error)) {
    console.error("Ошибка Axios:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || defaultMessage);
  } else {
    console.error("Неизвестная ошибка:", error);
    throw new Error(defaultMessage);
  }
};

// Аутентификация
export const registerUser = async (
  user: RegisterUser,
): Promise<LoginResponse> => {
  try {
    const res = await axios.post<LoginResponse>(
      `${API_BASE_URL}/register/`,
      user,
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось зарегистрировать пользователя");
  }
};

export const loginUser = async (user: LoginUser): Promise<LoginResponse> => {
  try {
    const res = await axios.post<LoginResponse>(`${API_BASE_URL}/login/`, user);
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось войти");
  }
};

// Пользователи
export const getUserData = async (token: string): Promise<UserReadExtended> => {
  try {
    const res = await axios.get<UserReadExtended>(
      `${API_BASE_URL}/users/me/`,
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось получить данные пользователя");
  }
};

export const updateUser = async (
  token: string,
  updateData: UpdateUserData,
): Promise<UserReadExtended> => {
  try {
    const res = await axios.put<UserReadExtended>(
      `${API_BASE_URL}/users/me/`,
      updateData,
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось обновить данные пользователя");
  }
};

export const getAllUsers = async (
  token: string,
): Promise<UserReadExtended[]> => {
  try {
    const res = await axios.get<UserReadExtended[]>(
      `${API_BASE_URL}/users/`,
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось получить всех пользователей");
  }
};

export const blockUser = async (
  userId: number,
  token: string,
  consent: boolean,
): Promise<UserReadExtended> => {
  try {
    const res = await axios.patch<UserReadExtended>(
      `${API_BASE_URL}/users/${userId}/block/`,
      { consent },
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось обновить статус пользователя");
  }
};

export const deleteUser = async (
  userId: number,
  token: string,
): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}/users/${userId}/`,
      getAuthHeader(token),
    );
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось удалить пользователя");
  }
};

export const getUserFavorites = async (
  token: string,
): Promise<EstateRead[]> => {
  try {
    const res = await axios.get<EstateRead[]>(
      `${API_BASE_URL}/users/me/favorites`,
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось получить избранные объекты");
  }
};

export const getUserOwnEstates = async (
  token: string,
  filters: FilterParams,
): Promise<EstateRead[]> => {
  try {
    const config = {
      params: filters,
      ...(token ? getAuthHeader(token) : {}),
    };

    const res = await axios.get<EstateRead[]>(
      `${API_BASE_URL}/users/me/estates`,
      config,
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось получить собственные объекты");
  }
};

export const getAllEstates = async (token?: string): Promise<EstateRead[]> => {
  try {
    const headers = token ? getAuthHeader(token) : {};
    const res = await axios.get<EstateRead[]>(
      `${API_BASE_URL}/estates/`,
      headers,
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось получить список недвижимости");
  }
};

export const getEstateById = async (estateId: number): Promise<EstateRead> => {
  try {
    const res = await axios.get<EstateRead>(
      `${API_BASE_URL}/estates/${estateId}/`,
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(
      error,
      "Не удалось получить информацию о недвижимости",
    );
  }
};

export const createEstate = async (
  estateData: EstateCreate,
  token: string,
): Promise<EstateRead> => {
  try {
    const res = await axios.post<EstateRead>(
      `${API_BASE_URL}/estates/`,
      estateData,
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось создать недвижимость");
  }
};

export const updateEstate = async (
  estateId: number,
  estateData: EstateUpdate,
  token: string,
): Promise<EstateRead> => {
  try {
    const res = await axios.put<EstateRead>(
      `${API_BASE_URL}/estates/${estateId}/`,
      estateData,
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось обновить недвижимость");
  }
};

export const deleteEstate = async (
  estateId: number,
  token: string,
): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}/estates/${estateId}/`,
      getAuthHeader(token),
    );
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось удалить недвижимость");
  }
};

export const updateEstateStatus = async (
  estateId: number,
  token: string,
  status: string,
): Promise<EstateRead> => {
  try {
    const res = await axios.patch<EstateRead>(
      `${API_BASE_URL}/estates/${estateId}/status`,
      { status },
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось изменить статус недвижимости");
  }
};

export const getFilteredEstates = async (
  filters: FilterParams,
  token?: string,
): Promise<EstateRead[]> => {
  try {
    const config = {
      params: filters,
      ...(token ? getAuthHeader(token) : {}),
    };

    const res = await axios.get<EstateRead[]>(
      `${API_BASE_URL}/estates/`,
      config,
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось получить список недвижимости");
  }
};

export const addEstateToFavorites = async (
  estateId: number,
  token: string,
): Promise<{ detail: string }> => {
  try {
    const res = await axios.post<{ detail: string }>(
      `${API_BASE_URL}/users/me/favorites/${estateId}/add`,
      null,
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(
      error,
      "Не удалось добавить недвижимость в избранное",
    );
  }
};

export const removeEstateFromFavorites = async (
  estateId: number,
  token: string,
): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}/users/me/favorites/${estateId}`,
      getAuthHeader(token),
    );
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(
      error,
      "Не удалось удалить недвижимость из избранного",
    );
  }
};

export const checkEstateInFavorites = async (
  estateId: number,
  token: string,
): Promise<boolean> => {
  try {
    const res = await axios.get<{ is_favorite: boolean }>(
      `${API_BASE_URL}/users/me/favorites/check/${estateId}`,
      getAuthHeader(token),
    );
    return res.data.is_favorite;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(
      error,
      "Не удалось проверить избранное для данной недвижимости",
    );
  }
};

export const generateReport = async (token: string): Promise<Blob> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_JAVA}/api/reports/generate`,
      {
        ...getAuthHeader(token),
        responseType: "blob",
      },
    );
    return response.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось сгенерировать отчёт");
  }
};
