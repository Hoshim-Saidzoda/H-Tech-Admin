import { atom } from "jotai";
import { api } from "../api/axios";

export interface Brand {
  id: number;
  name: string;
  completed: boolean;
}

export const brandsAtom = atom<Brand[]>([]);

export const fetchBrandsAtom = atom(
  null,
  async (_get, set) => {
    const { data } = await api.get("/Brand/get-brands");
    console.log("Fetched brands:", data.data),
    set(
      brandsAtom,
      data.data.map((brand: any) => ({
        id: brand.brandId,
        name: brand.brandName,
        completed: false,
      }))
  );  
});

export const addBrandAtom = atom(
  null,
  async (_get, set, payload: { name: string }) => {
    await api.post("/Brand/add-brand", null, {
      params: { BrandName: payload.name },
    });
    set(fetchBrandsAtom);
  }
);

export const editBrandAtom = atom(
  null,
  async (_get, set, payload: { id: number; name: string }) => {
     await api.put("/Brand/update-brand", null, {
      params: { BrandId: payload.id, BrandName: payload.name },
    });
    set(fetchBrandsAtom);
  }
);

export const deleteBrandAtom = atom(
  null,
  async (_get, set, id: number) => {
    await api.delete(`/Brand/delete-brand?id=${id}`);
    set(fetchBrandsAtom);
  }
);
