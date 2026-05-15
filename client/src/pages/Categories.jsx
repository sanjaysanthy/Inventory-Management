import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, Warning as WarningIcon, AddCircle } from "@mui/icons-material";
import { Stack } from "@mui/material";
import api from "../api/axios";
import { toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/categories/${selectedId}`, formData);
        toast.success("Category updated!");
      } else {
        await api.post("/categories", formData);
        toast.success("Category Created!");
      }
      handleClose();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving category");
    }
  };

  const handleOpenEdit = (cat) => {
    setIsEdit(true);
    setSelectedId(cat._id);
    setFormData({ name: cat.name, description: cat.description || "" });
    setOpenAdd(true);
  };

  const handleClose = () => {
    setOpenAdd(false);
    setIsEdit(false);
    setSelectedId(null);
    setFormData({ name: "", description: "" });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${selectedId}`);
      toast.success("🧹 Category and all related products deleted!");
      setOpenDelete(false);
      setSelectedId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion failed on server");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, mb: 0.5 }}>
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize your products into logical groups.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpenAdd(true)}
          startIcon={<AddCircle />}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          New Category
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>NAME</TableCell>
              <TableCell>DESCRIPTION</TableCell>
              <TableCell align="right" sx={{ pr: 4 }}>
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id} hover sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell sx={{ pl: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {cat.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {cat.description || "—"}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ pr: 4 }}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(cat)}
                        sx={{ bgcolor: "primary.light", color: "primary.main", "&:hover": { bgcolor: "primary.main", color: "white" } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedId(cat._id);
                          setOpenDelete(true);
                        }}
                        sx={{ bgcolor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", "&:hover": { bgcolor: "#ef4444", color: "white" } }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" color="text.secondary">
                    No categories found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* MODAL: ADD / EDIT */}
      <Dialog open={openAdd} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>
            {isEdit ? "Update Category" : "New Category"}
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: -1 }}>
              Enter the category details below.
            </Typography>
            <TextField label="Category Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
            <TextField label="Description" fullWidth multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleClose} sx={{ color: "text.secondary", fontWeight: 600 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ px: 4, py: 1, borderRadius: 2 }}>
              {isEdit ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* MODAL: DELETE (WARNING) */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              bgcolor: "rgba(239, 68, 68, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <WarningIcon color="error" sx={{ fontSize: 32 }} />
          </Box>
          <DialogTitle sx={{ textAlign: "center", pt: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            Critical Action Required
          </DialogTitle>
          <DialogContent sx={{ pb: 1 }}>
            <Typography align="center" color="text.secondary">
              Deleting this category will <strong>permanently remove</strong> all products linked to it. This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ width: "100%", justifyContent: "center", gap: 2, pt: 2 }}>
            <Button onClick={() => setOpenDelete(false)} variant="outlined" sx={{ borderRadius: 2, px: 3, color: "text.secondary", borderColor: "divider" }}>
              Keep Category
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 2, px: 3, bgcolor: "#ef4444" }}>
              Delete All Data
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Categories;
