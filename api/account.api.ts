import { api } from "./axios";

export interface LoginPayload {
  userName: string;
  password: string;
}

export interface RegisterPayload {
  userName: string;
  password: string;
}

export const login = async (data: LoginPayload) => {
  const res = await api.post("/Account/login", data);
  return res.data;
};

export const register = async (data: RegisterPayload) => {
  const res = await api.post("/Account/register", data);
  return res.data;
};
