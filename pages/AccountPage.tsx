import { useState } from "react";
import { useSetAtom } from "jotai";
import { loginAtom } from "../store/auth.store";
import { login } from "../api/account.api";

const AccountPage = () => {
  const setLogin = useSetAtom(loginAtom);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 

  const handleLogin = async () => {
    setErrorMsg("");
    if (!userName || !password) {
      setErrorMsg("Username and password are required");
      return;
    }

    try {
      setLoading(true);
      const data = await login({ userName, password });

       if (data.token) {
        localStorage.setItem("token", data.token);
        setLogin(data.token);
        alert("Login successful");
       } else {
        setErrorMsg("No token returned from server");
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      <h2>Login</h2>

      {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}

      <input
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  );
};

export default AccountPage;
