import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import {
  brandsAtom,
  fetchBrandsAtom,
  addBrandAtom,
  editBrandAtom,
  deleteBrandAtom,
} from "../store/Brand";

const BrandPage: React.FC = () => {
  const [brands] = useAtom(brandsAtom);
  const [, fetchBrands] = useAtom(fetchBrandsAtom);
  const [, addBrand] = useAtom(addBrandAtom);
  const [, editBrand] = useAtom(editBrandAtom);
  const [, deleteBrand] = useAtom(deleteBrandAtom);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const loadBrands = async () => {
      await fetchBrands();
    };
    loadBrands();
  }, []);

  const openModal = (brand: any | null = null) => {
    if (brand) {
      setEditId(brand.id);
      setName(brand.name);
    } else {
      setEditId(null);
      setName("");
    }
    setModalOpen(true);
  };

  const submitHandler = async () => {
    if (!name.trim()) return;
    if (editId) {
      await editBrand({ id: editId, name });
    } else {
      await addBrand({ name });
    }
    setModalOpen(false);
    setEditId(null);
    setName("");
  };

  return (
    <div className="p-4">
       <div className="mb-6">
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Brand
        </button>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
          >
            <div className="flex justify-between items-center">
               <h3 className="text-lg font-medium text-gray-900 truncate">
                {brand.name}
              </h3>
              
               <div className="flex space-x-2">
                 <button
                  onClick={() => openModal(brand)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Edit
                </button>
                
                 <button
                  onClick={() => deleteBrand(brand.id)}
                  className="px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

       {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
           <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setModalOpen(false)}
          />
          
           <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="relative bg-white rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
               <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editId ? "Edit Brand" : "Add Brand"}
                </h2>
              </div>

               <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>
              </div>

               <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitHandler}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

export default BrandPage;