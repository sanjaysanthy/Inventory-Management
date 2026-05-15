import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  MenuItem,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", formData);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", bgcolor: "white", overflow: "hidden" }}>
      {/* Left Branding Side (Hidden on mobile) */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          p: 8,
          position: "relative",
          bgcolor: "#0f172a",
          color: "white",
          backgroundImage: "radial-gradient(circle at 20% 30%, rgba(79, 70, 229, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "primary.main", display: "flex", alignItems: "center", justify: "center", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)" }}>
              <Typography sx={{ fontWeight: 900, fontSize: "1.2rem" }}>S</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.5px", fontFamily: "'Outfit', sans-serif" }}>
              StockSync
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1, mb: 3, letterSpacing: "-1px", fontFamily: "'Outfit', sans-serif" }}>
            Join the <Box component="span" sx={{ color: "primary.main" }}>future</Box> of inventory.
          </Typography>
          <Typography variant="h6" sx={{ color: "slate.400", fontWeight: 400, maxWidth: "500px", lineHeight: 1.6, mb: 6, opacity: 0.8 }}>
            Empower your team with real-time tracking, intelligent insights, and seamless collaboration.
          </Typography>

          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: "white" }}>10k+</Typography>
              <Typography variant="body2" sx={{ color: "slate.500", fontWeight: 500 }}>Active Users</Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: "white" }}>99.9%</Typography>
              <Typography variant="body2" sx={{ color: "slate.500", fontWeight: 500 }}>Uptime</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Right Form Side */}
      <Box
        sx={{
          width: { xs: "100%", md: "500px", lg: "600px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 4, md: 8 },
          bgcolor: "white",
        }}
      >
        <Box sx={{ maxWidth: "400px", mx: "auto", width: "100%" }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.5px", color: "slate.900" }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
              Start managing your inventory better today.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Full Name"
                placeholder="John Doe"
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputProps={{ sx: { borderRadius: 3, bgcolor: "#f8fafc" } }}
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{ sx: { borderRadius: 3, bgcolor: "#f8fafc" } }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{ sx: { borderRadius: 3, bgcolor: "#f8fafc" } }}
              />
              <TextField
                select
                fullWidth
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                InputProps={{ sx: { borderRadius: 3, bgcolor: "#f8fafc" } }}
              >
                <MenuItem value="Staff">Staff Member</MenuItem>
                <MenuItem value="Admin">System Administrator</MenuItem>
              </TextField>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
                  mt: 2,
                }}
              >
                Create Account
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
              Already have an account?{" "}
              <MuiLink component={Link} to="/login" sx={{ color: "primary.main", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                Sign In
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
