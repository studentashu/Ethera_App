import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Projects() {
    const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
const [editId, setEditId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProjects = () => {
    API.get("/projects").then(res => setProjects(res.data));
  };

  const fetchUsers = () => {
    API.get("/auth/users").then(res => setUsers(res.data));
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const toggleMember = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };
const handleEdit = (project) => {
  setName(project.name);
  setSelectedMembers(project.members.map(m => m._id));
  setEditId(project._id);
};
const handleDelete = async (id) => {
  if (!window.confirm("Delete this project?")) return;

  try {
    await API.delete(`/projects/${id}`);
    alert("Deleted successfully");
    fetchProjects();
  } catch (err) {
    alert("Delete failed");
  }
};
 const createProject = async () => {
  if (!name || selectedMembers.length === 0) {
    alert("Project name and members required");
    return;
  }

  try {
    if (editId) {
      // UPDATE
      await API.put(`/projects/${editId}`, {
        name,
        members: selectedMembers
      });
      alert("Project updated");
    } else {
      // CREATE
      await API.post("/projects", {
        name,
        members: selectedMembers
      });
      alert("Project created");
    }

    setName("");
    setSelectedMembers([]);
    setEditId(null);
    fetchProjects();
  } catch (err) {
    alert("Error saving project");
  }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Projects</h2>
      <button onClick={()=>{
        localStorage.removeItem("token");
        navigate("/login");
      }} style={styles.card}>Logout</button>
      <button onClick={()=>{
        navigate(-1);
      }} style={styles.card}>Back</button>
      {/* ADMIN SECTION */}
    {user.role === "admin" && (
  <div style={styles.card}>
    
    <input
      type="text"
      placeholder="Enter Project Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={styles.input}
    />

    <h4>Select Members:</h4>

    <div style={styles.memberList}>
      {users.map(u => (
        <label key={u._id} style={styles.memberItem}>
          <input
            type="checkbox"
            checked={selectedMembers.includes(u._id)}
            onChange={() => toggleMember(u._id)}
          />
          {u.name}
        </label>
      ))}
    </div>
<button style={styles.button} onClick={createProject}>
  {editId ? "Update Project" : "Create Project"}
</button>
  </div>
)}

      {/* PROJECT LIST */}
      <div style={styles.projectList}>
        {projects.map(p => (
         <div key={p._id} style={styles.projectCard}>
  <h3>{p.name}</h3>
  <p>
    Members: {p.members?.map(m => m.name).join(", ") || "No members"}
  </p>

  {user.role === "admin" && (
    <div style={{ marginTop: "10px" }}>
      <button onClick={() => handleEdit(p)} style={styles.smallBtn}>
        Edit
      </button>

      <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>
        Delete
      </button>
    </div>
  )}
</div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f5f6fa",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2f3640"
  },

  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    maxWidth: "400px",
    margin: "0 auto 20px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },

  memberList: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "150px",
    overflowY: "auto",
    marginBottom: "15px"
  },

  memberItem: {
    marginBottom: "5px",
    fontSize: "14px"
  },

  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#00b894",
    color: "white",
    cursor: "pointer"
  },

  projectList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  projectCard: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  }
};