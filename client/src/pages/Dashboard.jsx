import { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Inventory,
  Category,
  Business,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import api from "../api/axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/reports/dashboard-stats");
        setStats(data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9"];

  const metrics = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      color: "#6366f1",
      bg: "rgba(99, 102, 241, 0.1)",
    },
    {
      label: "Low Stock",
      value: stats.lowStockItems,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStockItems,
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.1)",
    },
    {
      label: "Inventory Value",
      value: `₹${stats.totalValue.toLocaleString()}`,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            color: "text.primary",
            mb: 1,
          }}
        >
          Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your inventory today.
        </Typography>
      </Box>

      {/* Metrics Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {metrics.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                bgcolor: "background.paper",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    bgcolor: item.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {index === 0 && <Inventory sx={{ color: item.color }} />}
                  {index === 1 && <Category sx={{ color: item.color }} />}
                  {index === 2 && <Business sx={{ color: item.color }} />}
                  {index === 3 && <BarChartIcon sx={{ color: item.color }} />}
                </Box>
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                  mb: 0.5,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Chart 1: Category Distribution (Pie) */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 4, height: 500, borderRadius: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Stock by Category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Distribution of inventory items.
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={stats.categoryStats}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Chart 2: Value per Category (Bar) */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 4, height: 500, borderRadius: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Inventory Value by Category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total financial investment per category (₹).
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={stats.categoryStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="totalValue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Chart 3: Products per Supplier (Full width Bar) */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, height: 450, borderRadius: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Supplier Performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comparison of product counts per supplier.
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={stats.supplierStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="products" fill="#6366f1" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
