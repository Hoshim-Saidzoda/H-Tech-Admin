import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/auth.store";
import { Box, Button, TextField, Typography, Stack, Alert } from "@mui/material";

const LoginPage: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);

    if (!userName.trim() || !password.trim()) {
      setError("Введите логин и пароль");
      return;
    }

    try {
      await loginUser({ userName, password });
      navigate("/"); 
    } catch (err: any) {
      console.error(err);
      setError("Неверный логин или пароль");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
          width: 360,
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleLogin} fullWidth>
            Login
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
