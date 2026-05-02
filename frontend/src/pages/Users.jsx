import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/admin/users");
      setUsers(res.data);
    } catch {
      alert("Access denied");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/auth/${id}`);
      fetchUsers();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>

      {users.map(u => (
        <div key={u._id} style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px"
        }}>
          <p><b>{u.name}</b></p>
          <p>{u.email}</p>
          <p>Role: {u.role}</p>

          {currentUser.role === "admin" && (
            <button
              onClick={() => deleteUser(u._id)}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px"
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}