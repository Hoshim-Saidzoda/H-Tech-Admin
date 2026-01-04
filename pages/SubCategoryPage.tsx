import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useParams, useNavigate } from "react-router-dom";
import {
  subCategoriesByCategoryAtom,
  fetchSubCategoriesByCategoryAtom,
  addSubCategoryAtom,
  editSubCategoryAtom,
  deleteSubCategoryAtom,
  SubCategory,
} from "../store/subcategory";
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const SubCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

   const [subCategories] = useAtom(subCategoriesByCategoryAtom);
  const [, fetchSubCategories] = useAtom(fetchSubCategoriesByCategoryAtom);
  const [, addSubCategory] = useAtom(addSubCategoryAtom);
  const [, editSubCategory] = useAtom(editSubCategoryAtom);
  const [, deleteSubCategory] = useAtom(deleteSubCategoryAtom);

   const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");

   useEffect(() => {
    if (categoryId) {
      fetchSubCategories(Number(categoryId));
    }
  }, [categoryId]);

   const openModal = (item?: SubCategory) => {
    if (item) {
      setEditId(item.id);
      setName(item.subCategoryName);
    } else {
      setEditId(null);
      setName("");
    }
    setOpen(true);
  };

   const submitHandler = async () => {
    if (!name.trim() || !categoryId) return;

    if (editId) {
      await editSubCategory({ id: editId, subCategoryName: name });
    } else {
      await addSubCategory({
        subCategoryName: name,
        categoryId: Number(categoryId),
      });
    }

    setOpen(false);
    setEditId(null);
    setName("");
    fetchSubCategories(Number(categoryId));  
  };

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        SubCategories
      </Typography>

      <Button variant="contained" onClick={() => openModal()}>
        Add SubCategory
      </Button>

      <Stack spacing={2} mt={2}>
        {subCategories.length === 0 ? (
          <Typography>No subcategories for this category</Typography>
        ) : (
          subCategories.map((sub) => (
            <Card
              key={sub.id}
              sx={{ p: 2, cursor: "pointer" }}
              onClick={() => navigate(`/sub-category/${sub.id}`)}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography>{sub.subCategoryName}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(sub);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteSubCategory(sub.id);
                      fetchSubCategories(Number(categoryId));
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Card>
          ))
        )}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? "Edit SubCategory" : "Add SubCategory"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="SubCategory Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={submitHandler}>Save</Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubCategoryPage;
