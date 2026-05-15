import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import { Lock, Person, Email, AdminPanelSettings } from "@mui/icons-material";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      await api.put("/auth/update-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, mb: 0.5 }}>
          Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your personal information and account security.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* ACCOUNT INFO SECTION */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 4, bgcolor: "white", border: "1px solid", borderColor: "divider" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
                fontSize: "2.5rem",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                boxShadow: "0 8px 16px rgba(79, 70, 229, 0.2)",
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
              {user.name}
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                px: 2,
                py: 0.5,
                borderRadius: "99px",
                bgcolor: user.role === "Admin" ? "rgba(79, 70, 229, 0.1)" : "rgba(0, 0, 0, 0.05)",
                color: user.role === "Admin" ? "primary.main" : "text.secondary",
                fontSize: "0.75rem",
                fontWeight: 700,
                mb: 3,
              }}
            >
              {user.role}
            </Box>

            <Divider sx={{ my: 3, opacity: 0.6 }} />

            <Stack spacing={3} textAlign="left">
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {user.email}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                  Display Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {user.name}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 4, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                Contact a system administrator to modify your name or email address.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* SECURITY SECTION */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: "white", border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
              <Box sx={{ p: 1, bgcolor: "primary.light", borderRadius: 2, color: "primary.main", display: "flex" }}>
                <Lock fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                Update Password
              </Typography>
            </Box>

            <form onSubmit={handlePasswordChange}>
              <Stack spacing={3}>
                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  required
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }}
                />
                
                <Divider sx={{ my: 1, opacity: 0.4 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>NEW SECURITY KEY</Typography>
                </Divider>

                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  InputProps={{ sx: { borderRadius: 2.5, bgcolor: "#f8fafc" } }}
                />
                
                <Box sx={{ pt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
