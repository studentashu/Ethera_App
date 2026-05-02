import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Task</h1>
        <p style={styles.subtitle}>Manage projects, tasks & teams easily</p>

        <div style={styles.buttonGroup}>
          <button 
            style={styles.loginBtn} 
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button 
            style={styles.registerBtn} 
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
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
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "300px"
  },

  title: {
    marginBottom: "10px",
    color: "#2f3640"
  },

  subtitle: {
    marginBottom: "30px",
    color: "#718093",
    fontSize: "14px"
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  loginBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0984e3",
    color: "white",
    cursor: "pointer"
  },

  registerBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#00b894",
    color: "white",
    cursor: "pointer"
  }
};