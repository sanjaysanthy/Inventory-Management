import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, PersonAdd } from "@mui/icons-material";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff",
  });

  const { user } = useContext(AuthContext);
  const currentUser = user;

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      toast.success("New staff account created!");
      setOpen(false);
      setFormData({ name: "", email: "", password: "", role: "Staff" });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating user");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser.id) return toast.error("You cannot delete yourself!");
    if (window.confirm("Are you sure? This user will lose all access.")) {
      try {
        await api.delete(`/users/${id}`);
        toast.success("User removed");
        fetchUsers();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, mb: 0.5 }}>
            Staff Members
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your team, assign roles, and control system access.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<PersonAdd />}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          Add Staff Member
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>NAME</TableCell>
              <TableCell>EMAIL ADDRESS</TableCell>
              <TableCell>ROLE</TableCell>
              <TableCell>JOINED DATE</TableCell>
              <TableCell align="right" sx={{ pr: 4 }}>
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item._id} hover sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell sx={{ pl: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {item.name}
                    {item._id === currentUser.id && (
                      <Box component="span" sx={{ ml: 1, fontSize: "0.6rem", bgcolor: "primary.light", color: "primary.main", px: 1, py: 0.2, borderRadius: 1, verticalAlign: "middle" }}>
                        YOU
                      </Box>
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={item.role}
                    disabled={item._id === currentUser.id}
                    onChange={(e) => handleRoleChange(item._id, e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        bgcolor: item.role === "Admin" ? "rgba(79, 70, 229, 0.05)" : "transparent",
                        color: item.role === "Admin" ? "primary.main" : "text.secondary",
                        minWidth: 120,
                      },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  >
                    <MenuItem value="Staff">Staff</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ pr: 4 }}>
                  <Tooltip title="Delete Account">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(item._id)}
                      disabled={item._id === currentUser.id}
                      sx={{ bgcolor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", "&:hover": { bgcolor: "#ef4444", color: "white" }, "&.Mui-disabled": { opacity: 0.3 } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* CREATE USER DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <form onSubmit={handleCreateUser}>
          <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>
            Add Staff Member
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: -1 }}>
              Enter the details for the new staff member.
            </Typography>
            <TextField label="Full Name" required fullWidth onChange={(e) => setFormData({ ...formData, name: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
            <TextField label="Email Address" type="email" required fullWidth onChange={(e) => setFormData({ ...formData, email: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
            <TextField label="Initial Password" type="password" required fullWidth onChange={(e) => setFormData({ ...formData, password: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }} />
            <TextField select label="Assign Role" value={formData.role} fullWidth onChange={(e) => setFormData({ ...formData, role: e.target.value })} InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }}>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: "text.secondary", fontWeight: 600 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ px: 4, py: 1, borderRadius: 2 }}>
              Create Account
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
