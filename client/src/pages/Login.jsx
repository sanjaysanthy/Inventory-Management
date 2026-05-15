import { useState, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton,
  Icon,
  Divider,
  Link as MuiLink,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff, FlashOn, Inventory } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box sx={{ height: "100vh", display: "flex", bgcolor: "background.default" }}>
      {/* Left Side: Visual/Branding */}
      <Box
        sx={{
          flex: 1.2,
          bgcolor: "primary.main",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 8,
          position: "relative",
          overflow: "hidden",
          color: "white",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              mx: "auto",
              boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
            }}
          >
            <Inventory sx={{ fontSize: 40 }} />
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              mb: 2,
              letterSpacing: "-1px",
            }}
          >
            Streamline Your Inventory
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, maxWidth: 450, mx: "auto" }}>
            The ultimate MERN-stack solution for modern businesses. Track, manage, and scale with ease.
          </Typography>
        </Box>
      </Box>

      {/* Right Side: Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              mb: 1,
              color: "text.primary",
            }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please enter your details to sign in.
          </Typography>


          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              placeholder="admin@example.com"
              margin="normal"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              InputProps={{
                sx: { borderRadius: 2.5, bgcolor: "#f8fafc" },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              InputProps={{
                sx: { borderRadius: 2.5, bgcolor: "#f8fafc" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              fullWidth
              label="Login As"
              margin="normal"
              value={formData.role || "Staff"}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              InputProps={{
                sx: { borderRadius: 2.5, bgcolor: "#f8fafc" },
              }}
            >
              <MenuItem value="Staff">Staff Member</MenuItem>
              <MenuItem value="Admin">System Administrator</MenuItem>
            </TextField>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => toast.info("Contact admin to reset password.")}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 4,
                py: 1.8,
                borderRadius: 2,
                fontSize: "1rem",
                boxShadow: "0 8px 16px rgba(79, 70, 229, 0.25)",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 4, fontWeight: 500 }}
          >
            Don't have an account?{" "}
            <MuiLink component={Link} to="/register" sx={{ color: "primary.main", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Create an Account
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
