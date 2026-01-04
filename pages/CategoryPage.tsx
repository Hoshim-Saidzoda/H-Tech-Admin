import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import {
  categoriesAtom,
  fetchCategoriesAtom,
  addCategoryAtom,
  editCategoryAtom,
  deleteCategoryAtom,
  
  Category,
} from "../store/Category";

const CategoryPage: React.FC = () => {
  const [categories] = useAtom(categoriesAtom);
  const [, fetchCategories] = useAtom(fetchCategoriesAtom);
  const [, addCategory] = useAtom(addCategoryAtom);
  const [, editCategory] = useAtom(editCategoryAtom);
  const [, deleteCategory] = useAtom(deleteCategoryAtom);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category: Category | null = null) => {
    if (category) {
      setEditId(category.id);
      setName(category.categoryName);
      setPreview(
        category.categoryImage
          ? `https://store-api.softclub.tj/images/${category.categoryImage}`
          : null
      );
    } else {
      setEditId(null);
      setName("");
      setImage(null);
      setPreview(null);
    }
    setModalOpen(true);
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const submitHandler = async () => {
    if (!name.trim()) return;

    if (editId) {
      await editCategory({
        id: editId,
        categoryName: name,
        image: image || undefined,
      });
    } else {
      await addCategory({
        categoryName: name,
        image: image || undefined,
      });
    }

    setModalOpen(false);
    setEditId(null);
    setName("");
    setImage(null);
  };

  return (
    <div className="p-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => openModal()}
      >
        Add Category
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
onClick={() => navigate(`/category/${category.id}`)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{category.categoryName}</h3>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(category);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(category.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            {category.categoryImage && (
              <img
                src={`https://store-api.softclub.tj/images/${category.categoryImage}`}
                alt={category.categoryName}
                className="mt-2 w-full h-48 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editId ? "Edit Category" : "Add Category"}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {preview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preview
                    </label>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitHandler}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;