import { atom } from "jotai";
import { api } from "../api/axios";

export interface SubCategory {
  id: number;
  subCategoryName: string;
}

export const selectedSubCategoryAtom = atom<SubCategory | null>(null);
export const subCategoriesAtom = atom<SubCategory[]>([]);
export const subCategoriesByCategoryAtom = atom<SubCategory[]>([]);

export const fetchSubCategoriesAtom = atom(
  null,
  async (_get, set) => {
    try {
      const res = await api.get("/SubCategory/get-sub-category");
      set(subCategoriesAtom, res.data.data || []);
    } catch (error) {
      console.error(error);
      set(subCategoriesAtom, []);
    }
  }
);

export const fetchSubCategoriesByCategoryAtom = atom(
  null,
  async (_get, set, categoryId: number) => {
    try {
      const res = await api.get(
        `/SubCategory/get-sub-category-by-category?categoryId=${categoryId}`
      );
      set(subCategoriesByCategoryAtom, res.data.data || []);
    } catch (error) {
       
        console.error(error);
        set(subCategoriesByCategoryAtom, []);
      }
    }
 
);

export const addSubCategoryAtom = atom(
  null,
  async (_get, set, payload: { subCategoryName: string; categoryId: number }) => {
    try {
      const formData = new FormData();
      formData.append("SubCategoryName", payload.subCategoryName);
      formData.append("CategoryId", String(payload.categoryId));

      await api.post("/SubCategory/add-sub-category", formData);
      set(fetchSubCategoriesByCategoryAtom, payload.categoryId);
    } catch (error) {
      console.error(error);
    }
  }
);

export const editSubCategoryAtom = atom(
  null,
  async (_get, set, payload: { id: number; subCategoryName: string; categoryId: number }) => {
    try {
      const formData = new FormData();
      formData.append("Id", String(payload.id));
      formData.append("SubCategoryName", payload.subCategoryName);

      await api.put("/SubCategory/update-sub-category", formData);
      set(fetchSubCategoriesByCategoryAtom, payload.categoryId);
    } catch (error) {
      console.error(error);
    }
  }
);

export const deleteSubCategoryAtom = atom(
  null,
  async (_get, set, payload: 
    { id: number; categoryId: number }) => {
    try {
      await api.delete(`/SubCategory/delete-sub-category?id=${payload.id}`);
     
      set(fetchSubCategoriesByCategoryAtom, payload.categoryId);
    
    } catch (error) {
      console.error(error);
    }
  }
);
