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
  Chip,
} from "@mui/material";
import { Delete, Edit, WarningAmber as WarningAmberIcon, AddCircle } from "@mui/icons-material";
import { Stack, Grid } from "@mui/material";
import api from "../api/axios";
import { toast } from "react-toastify";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchSuppliers = async () => {
    try {
      const { data } = await api.get("/suppliers");
      setSuppliers(data);
    } catch (err) {
      toast.error("Error loading suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/suppliers/${selectedId}`, formData);
        toast.success("Supplier Updated!");
      } else {
        await api.post("/suppliers", formData);
        toast.success("Supplier Added!");
      }
      handleClose();
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving supplier");
    }
  };

  const handleOpenEdit = (s) => {
    setIsEdit(true);
    setSelectedId(s._id);
    setFormData({
      name: s.name,
      contactPerson: s.contactPerson || "",
      email: s.email,
      phone: s.phone || "",
      address: s.address || "",
    });
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
    setIsEdit(false);
    setSelectedId(null);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/suppliers/${selectedId}`);
      toast.success("🧹 Supplier and all related products removed!");
      setOpenDelete(false);
      fetchSuppliers();
    } catch (err) {
      toast.error("Server error during deletion");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, mb: 0.5 }}>
            Suppliers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your external partners and their contact details.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpenForm(true)}
          startIcon={<AddCircle />}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          New Supplier
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>COMPANY</TableCell>
              <TableCell>CONTACT PERSON</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell align="center">PRODUCTS</TableCell>
              <TableCell align="right" sx={{ pr: 4 }}>
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s._id} hover sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell sx={{ pl: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {s.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {s.contactPerson || "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {s.email}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "inline-flex",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "99px",
                      bgcolor: "rgba(79, 70, 229, 0.08)",
                      color: "primary.main",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {s.productCount} Products
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ pr: 4 }}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(s)}
                        sx={{ bgcolor: "primary.light", color: "primary.main", "&:hover": { bgcolor: "primary.main", color: "white" } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedId(s._id);
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
            {suppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" color="text.secondary">
                    No suppliers found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ADD/EDIT MODAL */}
      <Dialog open={openForm} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>
            {isEdit ? "Update Supplier" : "New Supplier"}
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: -1 }}>
              Enter the supplier's contact information.
            </Typography>
            <TextField label="Supplier Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
            <TextField label="Contact Person" fullWidth required value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Email" type="email" fullWidth required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone" fullWidth value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
              </Grid>
            </Grid>

            <TextField label="Address" fullWidth multiline rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
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

      {/* DELETE MODAL */}
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
            <WarningAmberIcon color="error" sx={{ fontSize: 32 }} />
          </Box>
          <DialogTitle sx={{ textAlign: "center", pt: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            Permanent Deletion
          </DialogTitle>
          <DialogContent sx={{ pb: 1 }}>
            <Typography align="center" color="text.secondary">
              Deleting this supplier will <strong>permanently remove all products</strong> associated with them.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ width: "100%", justifyContent: "center", gap: 2, pt: 2 }}>
            <Button onClick={() => setOpenDelete(false)} variant="outlined" sx={{ borderRadius: 2, px: 3, color: "text.secondary", borderColor: "divider" }}>
              Keep Supplier
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 2, px: 3, bgcolor: "#ef4444" }}>
              Confirm Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Suppliers;
