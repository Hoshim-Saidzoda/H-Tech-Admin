import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";
import { fetchSubCategoryByIdAtom, selectedSubCategoryAtom } from "../store/subcategory";

const SubCategoryDetailPage: React.FC = () => {
  const { subCategoryId } = useParams<{ subCategoryId: string }>();
  const [, fetchSubCategoryById] = useAtom(fetchSubCategoryByIdAtom);
  const [subCategory] = useAtom(selectedSubCategoryAtom);

  useEffect(() => {
    if (subCategoryId) {
      fetchSubCategoryById(Number(subCategoryId));
    }
  }, [subCategoryId]);

  if (!subCategory) return <p>SubCategory not found</p>;

  return (
    <div>
      <h1>{subCategory.subCategoryName}</h1>
      <p>ID: {subCategory.id}</p>
    </div>
  );
};

export default SubCategoryDetailPage;
