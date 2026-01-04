import { atom } from "jotai";
import { api } from "../api/axios";

export interface TodoImage {
  id: number;
  imageName: string;
}

export interface Todo {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  images: TodoImage[];
}

interface Brand {
  brandId: number;
  brandName: string;
}

interface GetBrandsResponse {
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRecord: number;
  data: Brand[];
  errors: string[];
  statusCode: number;
}

export const todosAtom = atom<Todo[]>([]);
export const currentTodoAtom = atom<Todo | null>(null);

export const fetchTodosAtom = atom(
  null,
  async (_get, set) => {
    const { data } = await api.get<GetBrandsResponse>("/Brand/get-brands");
    set(
      todosAtom,
      data.data.map((brand) => ({
        id: brand.brandId,
        name: brand.brandName,
        description: "",
        completed: false,
        images: [],
      }))
    );
  }
);

export const fetchTodoByIdAtom = atom(
  null,
  async (_get, set, id: number) => {
    const { data } = await api.get<Todo>(`/to-dos/${id}`);
    set(currentTodoAtom, data);
  }
);

export const addTodoAtom = atom(
  null,
  async (_get, set, payload: { name: string; description: string }) => {
    await api.post("/to-dos", payload);
    set(fetchTodosAtom);
  }
);

export const editTodoAtom = atom(
  null,
  async (_get, set, payload: { id: number; name: string; description: string }) => {
    await api.put("/to-dos", payload);
    set(fetchTodosAtom);
  }
);

export const deleteTodoAtom = atom(
  null,
  async (_get, set, id: number) => {
    await api.delete(`/to-dos/?id=${id}`);
    set(fetchTodosAtom);
  }
);

export const completedTodoAtom = atom(
  null,
  async (_get, set, id: number) => {
    await api.put(`/to-dos/completed?id=${id}`);
    set(fetchTodosAtom);
  }
);

export const addImageAtom = atom(
  null,
  async (_get, set, payload: { id: number; image: File }) => {
    const formData = new FormData();
    formData.append("Images", payload.image);
    await api.post(`/to-dos/${payload.id}/images`, formData);
    set(fetchTodosAtom);
  }
);

export const deleteImageAtom = atom(
  null,
  async (_get, set, imageId: number) => {
    await api.delete(`/to-dos/images/${imageId}`);
    set(fetchTodosAtom);
  }
);
