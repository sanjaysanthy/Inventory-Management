import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  Stack,
  Grid,
} from "@mui/material";
import {
  Delete,
  Edit,
  AddCircle,
  RemoveCircle,
  Search,
  FilterList,
  RestartAlt,
} from "@mui/icons-material";
import api from "../api/axios";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modals State
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    quantity: 0,
    price: 0,
    lowStockThreshold: 10,
  });

  const loadData = async () => {
    try {
      const [p, c, s] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/suppliers"),
      ]);
      setProducts(p.data);
      setCategories(c.data);
      setSuppliers(s.data);
    } catch (err) {
      toast.error("Failed to load inventory data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "All" || item.category?._id === filterCategory;
    const matchesSupplier = filterSupplier === "All" || item.supplier?._id === filterSupplier;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterCategory("All");
    setFilterSupplier("All");
    setFilterStatus("All");
    toast.info("Filters reset");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        lowStockThreshold: Number(formData.lowStockThreshold),
      };

      if (isEdit) {
        await api.put(`/products/${selectedProduct}`, payload);
        toast.success("Product updated!");
      } else {
        await api.post("/products", payload);
        toast.success("Product created!");
      }

      handleClose();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving product");
    }
  };

  const adjustStock = async (id, currentQty, amount) => {
    try {
      const newQty = currentQty + amount;
      if (newQty < 0) return toast.warning("Stock cannot be negative");

      await api.put(`/products/${id}`, { quantity: newQty });
      loadData();
    } catch (err) {
      toast.error("Stock update failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product permanently?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product removed");
        loadData();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const handleOpenEdit = (product) => {
    setIsEdit(true);
    setSelectedProduct(product._id);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category?._id || "",
      supplier: product.supplier?._id || "",
      quantity: product.quantity,
      price: product.price,
      lowStockThreshold: product.lowStockThreshold || 10,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setSelectedProduct(null);
    setFormData({
      name: "",
      sku: "",
      category: "",
      supplier: "",
      quantity: 0,
      price: 0,
      lowStockThreshold: 10,
    });
  };

  const getStatusChip = (status) => {
    const colors = {
      "In Stock": { bg: "#ecfdf5", text: "#059669", border: "#d1fae5" },
      "Low Stock": { bg: "#fffbeb", text: "#d97706", border: "#fef3c7" },
      "Out of Stock": { bg: "#fef2f2", text: "#dc2626", border: "#fee2e2" },
    };
    const style = colors[status] || colors["In Stock"];

    return (
      <Box
        sx={{
          display: "inline-flex",
          px: 1.5,
          py: 0.5,
          borderRadius: "99px",
          bgcolor: style.bg,
          color: style.text,
          border: "1px solid",
          borderColor: style.border,
          fontSize: "0.75rem",
          fontWeight: 700,
        }}
      >
        {status}
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, mb: 0.5 }}>
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your inventory items, stock levels, and pricing.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<AddCircle />}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          New Product
        </Button>
      </Box>

      {/* Modern Filter Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 3, bgcolor: "white" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} lg={4}>
            <TextField
              placeholder="Search products..."
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: "#f8fafc" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              InputProps={{ sx: { borderRadius: 2, bgcolor: "#f8fafc" } }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Supplier"
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              InputProps={{ sx: { borderRadius: 2, bgcolor: "#f8fafc" } }}
            >
              <MenuItem value="All">All Suppliers</MenuItem>
              {suppliers.map((sup) => (
                <MenuItem key={sup._id} value={sup._id}>
                  {sup.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              InputProps={{ sx: { borderRadius: 2, bgcolor: "#f8fafc" } }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResetFilters}
              startIcon={<RestartAlt />}
              sx={{ borderRadius: 2, borderColor: "divider", color: "text.secondary" }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>PRODUCT</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell>SUPPLIER</TableCell>
              <TableCell align="center">STOCK</TableCell>
              <TableCell>PRICE</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell align="right" sx={{ pr: 4 }}>
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((row) => (
              <TableRow key={row._id} hover sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell sx={{ pl: 4 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {row.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: "0.5px" }}>
                      {row.sku}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {row.category?.name || "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {row.supplier?.name || "—"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "#f1f5f9", p: 0.5, borderRadius: 2 }}>
                    <IconButton size="small" onClick={() => adjustStock(row._id, row.quantity, -1)} sx={{ color: "text.secondary" }}>
                      <RemoveCircle fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 24, textAlign: "center" }}>
                      {row.quantity}
                    </Typography>
                    <IconButton size="small" onClick={() => adjustStock(row._id, row.quantity, 1)} sx={{ color: "primary.main" }}>
                      <AddCircle fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    ₹{row.price?.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>{getStatusChip(row.status)}</TableCell>
                <TableCell align="right" sx={{ pr: 4 }}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ bgcolor: "primary.light", color: "primary.main", "&:hover": { bgcolor: "primary.main", color: "white" } }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(row._id)} sx={{ bgcolor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", "&:hover": { bgcolor: "#ef4444", color: "white" } }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" color="text.secondary">
                    No products found matching your search.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Modern Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>
            {isEdit ? "Update Product" : "New Product"}
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: -1 }}>
              Enter the product details below. All fields are required.
            </Typography>
            <TextField label="Product Name" required fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
            <TextField label="SKU" required fullWidth value={formData.sku} disabled={isEdit} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />

            <TextField
              select
              label="Category"
              required
              fullWidth
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Supplier"
              required
              fullWidth
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }}
            >
              {suppliers.map((sup) => (
                <MenuItem key={sup._id} value={sup._id}>
                  {sup.name}
                </MenuItem>
              ))}
            </TextField>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Stock Quantity" type="number" fullWidth value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Unit Price (₹)" type="number" fullWidth value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
              </Grid>
            </Grid>

            <TextField label="Low Stock Threshold" type="number" fullWidth helperText="System will alert you when stock falls below this level." value={formData.lowStockThreshold} onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleClose} sx={{ color: "text.secondary", fontWeight: 600 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ px: 4, py: 1, borderRadius: 2 }}>
              {isEdit ? "Update Product" : "Create Product"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Products;
