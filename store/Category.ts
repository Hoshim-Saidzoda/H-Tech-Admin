import { atom } from "jotai";
import { api } from "../api/axios";

export interface SubCategory {
  id: number;
  subCategoryName: string;
}

export interface Category {
  id: number;
  categoryName: string;
  categoryImage?: string;
  subCategories: SubCategory[];
}

export const categoriesAtom = atom<Category[]>([]);

export const fetchCategoriesAtom = atom(null, async (_, set) => {
  try {
    const res = await api.get("/Category/get-categories");
    set(categoriesAtom, res.data.data || []);
  } catch (error) {
    console.error(error);
    set(categoriesAtom, []);
  }
});

export const addCategoryAtom = atom(
  null,
  async (_, set, payload: { categoryName: string; image?: File }) => {
    try {
      const fd = new FormData();
      fd.append("CategoryName", payload.categoryName);
      if (payload.image) fd.append("CategoryImage", payload.image);

      await api.post("/Category/add-category", fd);
      set(fetchCategoriesAtom);
    } catch (error) {
      console.error(error);
    }
  }
);

export const editCategoryAtom = atom(
  null,
  async (
    _,
    set,
    payload: { id: number; categoryName: string; image?: File }
  ) => {
    try {
      const fd = new FormData();
      fd.append("Id", String(payload.id));
      fd.append("CategoryName", payload.categoryName);
      if (payload.image) fd.append("CategoryImage", payload.image);

      await api.put("/Category/update-category", fd);
      set(fetchCategoriesAtom);
    } catch (error) {
      console.error(error);
    }
  }
);

export const deleteCategoryAtom = atom(
  null,
  async (_, set, id: number) => {
    try {
      await api.delete(`/Category/delete-category?id=${id}`);
      set(fetchCategoriesAtom);
    } catch (error) {
      console.error(error);
    }
  }
);
