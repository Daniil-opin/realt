import axios, { AxiosError } from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface User extends UserData {
  id: number;
}

export interface UserData {
  last_name: string;
  first_name: string;
  email: string;
  tel: string;
  password: string;
  role: {
    name: string;
    id: number;
  };
  consent: boolean;
}

export interface LoginResponse extends User {
  token: string;
}

export interface RegisterResponse extends LoginResponse {}

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

export interface UpdateUser {
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  password: string;
  role_id: number;
  consent: boolean;
}

export interface UpdateUserResponse extends UpdateUser {}

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

export const registerUser = async (
  user: RegisterUser,
): Promise<RegisterResponse> => {
  try {
    const res = await axios.post<RegisterResponse>(
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

export const getUserData = async (token: string): Promise<User> => {
  try {
    const res = await axios.get<User>(
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
  updateData: UpdateUser,
): Promise<UpdateUserResponse> => {
  try {
    const res = await axios.put<UpdateUserResponse>(
      `${API_BASE_URL}/users/me/`,
      updateData,
      getAuthHeader(token),
    );
    return res.data;
  } catch (error: AxiosError | unknown) {
    return handleAxiosError(error, "Не удалось обновить данные пользователя");
  }
};
