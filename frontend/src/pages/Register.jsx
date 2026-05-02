import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ role: "member" });
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      await API.post("/auth/register", form);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        <input
          style={styles.input}
          placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <select
          style={styles.input}
          onChange={e => setForm({ ...form, role: e.target.value })}
          value={form.role}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button style={styles.button} onClick={submit}>
          Register
        </button>

        <p style={styles.link}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={styles.linkBtn}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    fontFamily: "Arial, sans-serif"
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  title: {
    textAlign: "center",
    color: "#2f3640"
  },

  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none"
  },

  button: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#00b894",
    color: "white",
    cursor: "pointer"
  },

  link: {
    textAlign: "center",
    fontSize: "14px"
  },

  linkBtn: {
    color: "#0984e3",
    cursor: "pointer",
    fontWeight: "bold"
  }
};