import { atom } from 'jotai';

export const loginUser = async (body: { userName: string; password: string }) => {
  const res = await fetch("https://store-api.softclub.tj/Account/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await res.json();
  const token = result.data; 
  localStorage.setItem("token", token);
  localStorage.setItem("isAuth", "true");

  return result;
};

export const loginAtom = atom(
  null,
  async (get, set, credentials: { userName: string; password: string }) => {
    try {
      const result = await loginUser(credentials);
      // Optionally set some auth state atom if needed
      return result;
    } catch (error) {
      throw error;
    }
  }
);

export const isAuth = () => {
  return localStorage.getItem("isAuth") === "true";
};
