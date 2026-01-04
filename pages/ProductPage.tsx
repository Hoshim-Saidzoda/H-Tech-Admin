import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import {
  productsAtom,
  fetchProductsAtom,
  addProductAtom,
  editProductAtom,
  deleteProductAtom,
  deleteProductImageAtom,
} from "../store/Product";
import { Plus, Pencil, Trash2, X, Check, Image as ImageIcon, Upload, Eye } from "lucide-react";

interface Product {
  id: number;
  productName: string;
  price: number;
  code?: string;
  description?: string;
  brandId?: number;
  colorId?: number;
  quantity?: number;
  subCategoryId?: number;
  hasDiscount?: boolean;
  discountPrice?: number;
  weight?: string;
  size?: string;
  image?: string;
}

const ProductPage: React.FC = () => {
  const [products] = useAtom(productsAtom);
  const [, fetchProducts] = useAtom(fetchProductsAtom);
  const [, addProduct] = useAtom(addProductAtom);
  const [, editProduct] = useAtom(editProductAtom);
  const [, deleteProduct] = useAtom(deleteProductAtom);
  const [, deleteImage] = useAtom(deleteProductImageAtom);

  const [formData, setFormData] = useState<any>({
    name: "",
    price: "",
    code: "",
    description: "",
    brandId: "",
    colorId: "",
    quantity: "",
    subCategoryId: "",
    hasDiscount: false,
    discountPrice: "",
    weight: "",
    size: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev: any) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      code: "",
      description: "",
      brandId: "",
      colorId: "",
      quantity: "",
      subCategoryId: "",
      hasDiscount: false,
      discountPrice: "",
      weight: "",
      size: "",
    });
    setImage(null);
    setEditId(null);
    setImagePreview(null);
  };

  const openAddModal = () => {
    resetForm();
    setEditId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditId(product.id);
    setFormData({
      name: product.productName,
      price: String(product.price),
      code: product.code || "",
      description: product.description || "",
      brandId: String(product.brandId || ""),
      colorId: String(product.colorId || ""),
      quantity: String(product.quantity || ""),
      subCategoryId: String(product.subCategoryId || ""),
      hasDiscount: product.hasDiscount || false,
      discountPrice: String(product.discountPrice || ""),
      weight: product.weight || "",
      size: product.size || "",
    });
    setImagePreview(product.image ? `https://store-api.softclub.tj/images/${product.image}` : null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const openViewModal = (product: Product) => setSelectedProduct(product);
  const closeViewModal = () => setSelectedProduct(null);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      if (editId) {
        const fd = new FormData();
        fd.append("ProductName", formData.name);
        fd.append("Description", formData.description);
        fd.append("Code", formData.code);
        fd.append("Price", formData.price);
        fd.append("BrandId", formData.brandId);
        fd.append("ColorId", formData.colorId);
        fd.append("Quantity", formData.quantity);
        fd.append("SubCategoryId", formData.subCategoryId);
        fd.append("HasDiscount", formData.hasDiscount.toString());
        if (formData.hasDiscount && formData.discountPrice) fd.append("DiscountPrice", formData.discountPrice);
        if (formData.weight) fd.append("Weight", formData.weight);
        if (formData.size) fd.append("Size", formData.size);
        if (image) fd.append("Images", image);
        await editProduct({ id: editId, data: fd });
      } else {
        await addProduct({
          images: image ? [image] : [],
          BrandId: Number(formData.brandId),
          ColorId: Number(formData.colorId),
          ProductName: formData.name,
          Description: formData.description,
          Quantity: Number(formData.quantity),
          Code: formData.code,
          Price: Number(formData.price),
          HasDiscount: formData.hasDiscount,
          DiscountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
          SubCategoryId: Number(formData.subCategoryId),
          Weight: formData.weight,
          Size: formData.size,
        });
      }
      closeModal();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => await deleteProduct(id);
  const handleDeleteImage = async (id: number) => await deleteImage(id);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        </div>
        <div className="mb-6">
          <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg">
            <Plus size={20} /> Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-100">
                {product.image ? <img src={`https://store-api.softclub.tj/images/${product.image}`} alt={product.productName} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon className="h-16 w-16 text-gray-400" /></div>}
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">${product.price}</div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => openViewModal(product)} className="p-2 bg-white/90 rounded-full"><Eye size={16} /></button>
                  <button onClick={() => openEditModal(product)} className="p-2 bg-white/90 rounded-full"><Pencil size={16} /></button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-white/90 rounded-full"><Trash2 size={16} className="text-red-600" /></button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg truncate">{product.productName}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={closeModal}><X size={24} /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="border p-2 rounded"/>
              <input name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" className="border p-2 rounded"/>
              <input name="code" value={formData.code} onChange={handleInputChange} placeholder="Code" className="border p-2 rounded"/>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="border p-2 rounded"/>
              <input name="brandId" value={formData.brandId} onChange={handleInputChange} placeholder="Brand ID" className="border p-2 rounded"/>
              <input name="colorId" value={formData.colorId} onChange={handleInputChange} placeholder="Color ID" className="border p-2 rounded"/>
              <input name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Quantity" className="border p-2 rounded"/>
              <input name="subCategoryId" value={formData.subCategoryId} onChange={handleInputChange} placeholder="SubCategory ID" className="border p-2 rounded"/>
              <input type="file" onChange={handleFileChange} />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">{editId ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
