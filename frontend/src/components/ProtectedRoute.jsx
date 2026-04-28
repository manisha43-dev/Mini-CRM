// import { AuthProvider, useAuth } from '../context/AuthContext'
import { CircularProgress, Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import AuthProvider, { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        
      >
        <CircularProgress />
      </Box>
    );
  } else {
    return user ? <Outlet /> : <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
