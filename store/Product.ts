import { atom } from "jotai";
import { api } from "../api/axios";

export interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  color: string;
  categoryId: number;
  categoryName: string;
  discountPrice: number;
  hasDiscount: boolean;
  productInMyCart: boolean;
  productInfoFromCart: null;
  quantity: number;
  code?: string;
  description?: string;
  brandId?: number;
  colorId?: number;
  subCategoryId?: number;
  weight?: string;
  size?: string;
}

export interface Color {
  id: number;
  colorName: string;
}

export interface Brand {
  id: number;
  brandName: string;
}

export interface GetProductsParams {
  ProductName?: string;
  BrandId?: number;
  ColorId?: number;
  CategoryId?: number;
  SubcategoryId?: number;
  MinPrice?: number;
  MaxPrice?: number;
  PageNumber?: number;
  PageSize?: number;
}

export interface ProductsResponse {
  products: Product[];
  colors: Color[];
  brands: Brand[];
  minMaxPrice: {
    minPrice: number;
    maxPrice: number;
  };
}

export interface PaginatedProductsResponse {
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRecord: number;
  data: ProductsResponse;
  errors: string[];
  statusCode: number;
}

 export const getProducts = async (
  params?: GetProductsParams
): Promise<ProductsResponse> => {
  try {
    const res = await api.get<PaginatedProductsResponse>("/Product/get-products", { params });

    if (res.status === 204 || !res.data?.data) {
      return {
        products: [],
        colors: [],
        brands: [],
        minMaxPrice: { minPrice: 0, maxPrice: 0 },
      };
    }

    return res.data.data;
  } catch (error) {
    console.error(error);
    return {
      products: [],
      colors: [],
      brands: [],
      minMaxPrice: { minPrice: 0, maxPrice: 0 },
    };
  }
};

 export const deleteProduct = async (id: number) => {
  try {
    const res = await api.delete(`/Product/delete-product?id=${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
   }
};

 export const deleteProductImage = async (id: number) => {
  try {
    const res = await api.delete(`/Product/delete-product-image?id=${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
   }
};

 export const addProduct = async (payload: {
  images: File[];
  BrandId: number;
  ColorId: number;
  ProductName: string;
  Description: string;
  Quantity: number;
  Code: string;
  Price: number;
  HasDiscount: boolean;
  DiscountPrice?: number;
  SubCategoryId: number;
  Weight?: string;
  Size?: string;
}) => {
  try {
    const formData = new FormData();

    payload.images.forEach(file => formData.append("Images", file));
    formData.append("BrandId", String(payload.BrandId));
    formData.append("ColorId", String(payload.ColorId));
    formData.append("ProductName", payload.ProductName);
    formData.append("Description", payload.Description);
    formData.append("Quantity", String(payload.Quantity));
    formData.append("Code", payload.Code);
    formData.append("Price", String(payload.Price));
    formData.append("HasDiscount", String(payload.HasDiscount));
    formData.append("SubCategoryId", String(payload.SubCategoryId));

    if (payload.DiscountPrice !== undefined) formData.append("DiscountPrice", String(payload.DiscountPrice));
    if (payload.Weight) formData.append("Weight", payload.Weight);
    if (payload.Size) formData.append("Size", payload.Size);

    const res = await api.post("/Product/add-product", formData);
    return res.data;
  } catch (error) {
    console.error(error);
   }
};

 export const editProduct = async (id: number, payload: FormData) => {
  try {
    const res = await api.put(`/Product/update-product?id=${id}`, payload, {
      transformRequest: [(data) => data],  
    });
    return res.data.data;
  }  catch (error) {
    console.error(error);
   }
};

 export const productsAtom = atom<Product[]>([]);
export const productsLoadingAtom = atom(false);
export const productsErrorAtom = atom<string | null>(null);

 export const fetchProductsAtom = atom(null, async (_, set) => {
  set(productsLoadingAtom, true);
  try {
    const data = await getProducts({ PageNumber: 1, PageSize: 50 });
    set(productsAtom, data.products);
  } catch (error) {
    set(productsErrorAtom, "Ошибка при загрузке продуктов");
  } finally {
    set(productsLoadingAtom, false);
  }
});

 export const addProductAtom = atom(null, async (_, set, payload: Parameters<typeof addProduct>[0]) => {
  try {
    await addProduct(payload);
    const data = await getProducts({ PageNumber: 1, PageSize: 50 });
    set(productsAtom, data.products);
  }  catch (error) {
    console.error(error);
   }
});

 export const editProductAtom = atom(null, async (_, set, payload: { id: number; data: FormData }) => {
  try {
    await editProduct(payload.id, payload.data);
    const data = await getProducts({ PageNumber: 1, PageSize: 50 });
    set(productsAtom, data.products);
  }  catch (error) {
    console.error(error);
   }
});

 export const deleteProductAtom = atom(null, async (_, set, id: number) => {
  try {
    await deleteProduct(id);
    const data = await getProducts({ PageNumber: 1, PageSize: 50 });
    set(productsAtom, data.products);
  } catch (error) {
    console.error(error);
   }
});

 export const deleteProductImageAtom = atom(null, async (_, set, id: number) => {
  try {
    await deleteProductImage(id);
    const data = await getProducts({ PageNumber: 1, PageSize: 50 });
    set(productsAtom, data.products);
  }  catch (error) {
    console.error(error);
   }
});
