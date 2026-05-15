import { useContext } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  Icon,
} from "@mui/material";
import {
  Dashboard,
  Inventory,
  Category,
  Business,
  Person,
  Logout,
  People,
} from "@mui/icons-material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const drawerWidth = 260;

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Products", icon: <Inventory />, path: "/products" },
    { text: "Categories", icon: <Category />, path: "/categories" },
    { text: "Suppliers", icon: <Business />, path: "/suppliers" },
    ...(user.role === "Admin"
      ? [
          {
            text: "Users Management",
            icon: <People />,
            path: "/usersManagement",
          },
        ]
      : []),
    { text: "Profile", icon: <Person />, path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
            boxShadow: "4px 0 24px rgba(0,0,0,0.02)",
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
            }}
          >
            <Inventory fontSize="small" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "text.primary",
            }}
          >
            StockSync<span style={{ color: "#4f46e5" }}>.</span>
          </Typography>
        </Box>

        <Box sx={{ px: 2, py: 2 }}>
          <Typography
            variant="caption"
            sx={{
              px: 2,
              mb: 1,
              display: "block",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: "1px",
              fontSize: "0.7rem",
            }}
          >
            Menu
          </Typography>
          <List sx={{ px: 0 }}>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 3,
                  mb: 1,
                  mx: 1,
                  width: "calc(100% - 16px)",
                  color: "text.secondary",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  px: 2,
                  py: 1.2,
                  "&:hover": {
                    bgcolor: "rgba(79, 70, 229, 0.05)",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": { color: "primary.main", transform: "scale(1.1)" },
                  },
                  ...(window.location.pathname === item.path && {
                    bgcolor: "rgba(79, 70, 229, 0.1)",
                    color: "primary.main",
                    fontWeight: 700,
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      height: "60%",
                      width: 4,
                      bgcolor: "primary.main",
                      borderRadius: "0 4px 4px 0",
                    }
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "inherit",
                    transition: "color 0.2s",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: "inherit",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ mb: 2, opacity: 0.5 }} />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1,
              bgcolor: "rgba(79, 70, 229, 0.05)",
              color: "primary.main",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "primary.main",
                color: "white",
              },
            }}
          >
            Sign Out
          </Button>
          <Box sx={{ mt: 2, px: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Logged in as
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {user.name} ({user.role})
            </Typography>
          </Box>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          bgcolor: "background.default",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Sidebar;
