import { atom } from "jotai";
import { api } from "../api/axios";

export interface SubCategory {
  id: number;
  subCategoryName: string;
}

export interface CategoryById {
  id: number;
  categoryName: string;
  categoryImage?: string;
  subCategories: SubCategory[];
}

export const getCategoryById = async (id: number): Promise<CategoryById> => {
  const res = await api.get(`/Category/get-category-by-id?id=${id}`);
  return res.data.data;
};

export const categoryByIdAtom = atom<CategoryById | null>(null);
export const categoryByIdLoadingAtom = atom(false);
export const categoryByIdErrorAtom = atom<string | null>(null);

export const fetchCategoryByIdAtom = atom(
  null,
  async (_get, set, id: number) => {
    set(categoryByIdLoadingAtom, true);
    set(categoryByIdErrorAtom, null);
    try {
      const data = await getCategoryById(id);
      set(categoryByIdAtom, data);
    } catch {
      set(categoryByIdErrorAtom, "error");
    } finally {
      set(categoryByIdLoadingAtom, false);
    }
  }
);
