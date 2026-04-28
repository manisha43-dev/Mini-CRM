
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Dashboard, People, Business, Assignment } from "@mui/icons-material";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";

const DRAWER_WIDTH = 220;

const navItems = [
  { label: "Dashboard", path: "/", icon: <Dashboard /> },
  { label: "Leads", path: "/leads", icon: <People /> },
  { label: "Companies", path: "/companies", icon: <Business /> },
  { label: "Tasks", path: "/tasks", icon: <Assignment /> },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <List sx={{ pt: 8 }}>
      {navItems.map((item) => {return(
        <ListItemButton
          key={item.path}
          selected={location.pathname === item.path}
          onClick={() => {
            navigate(item.path);
            if (isMobile) setMobileOpen(false);
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      )})}
    </List>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Bar */}
      <AppBar
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, position: "fixed" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton
              sx={{color:"inherit"}}
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              MINI CRM
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {user?.name}
            </Typography>
            
            <Button sx={{ color: "inherit" }} onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
      
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Desktop sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              pt: 8,
            },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: 8,
          ml: { xs: 0, md: `0px` },
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
