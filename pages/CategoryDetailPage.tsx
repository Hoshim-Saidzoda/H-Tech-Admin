import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import {
  subCategoriesAtom,
  fetchSubCategoriesAtom,
  addSubCategoryAtom,
  editSubCategoryAtom,
  deleteSubCategoryAtom,
  SubCategory,
} from "../store/SubCategory";

const CategoryDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [subCategories] = useAtom(subCategoriesAtom);
  const [, fetchSubCategories] = useAtom(fetchSubCategoriesAtom);
  const [, addSubCategory] = useAtom(addSubCategoryAtom);
  const [, editSubCategory] = useAtom(editSubCategoryAtom);
  const [, deleteSubCategory] = useAtom(deleteSubCategoryAtom);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const openModal = (subCategory: SubCategory | null = null) => {
    if (subCategory) {
      setEditId(subCategory.id);
      setName(subCategory.subCategoryName);
    } else {
      setEditId(null);
      setName("");
    }
    setModalOpen(true);
  };

  const submitHandler = async () => {
    if (!name.trim() || !categoryId) return;

    if (editId) {
      await editSubCategory({ id: editId, subCategoryName: name });
    } else {
      await addSubCategory({ subCategoryName: name, categoryId: Number(categoryId) });
    }

    setModalOpen(false);
    setEditId(null);
    setName("");
  };

  return (
    <div className="p-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => openModal()}
      >
        Add SubCategory
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {subCategories.map((sub) => (
          <div key={sub.id} className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
               onClick={() => navigate(`/sub-category/${sub.id}`)}>
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{sub.subCategoryName}</span>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  onClick={() => openModal(sub)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                  onClick={() => deleteSubCategory(sub.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editId ? "Edit SubCategory" : "Add SubCategory"}
              </h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SubCategory Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  onClick={submitHandler}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetailPage;