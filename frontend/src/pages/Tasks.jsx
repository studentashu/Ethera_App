import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const [editId, setEditId] = useState(null);
  const handleDelete = async (id) => {
  if (!window.confirm("Delete this task?")) return;

  try {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  } catch (err) {
    alert("Delete failed");
  }
};
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [project, setProject] = useState("");
  const [dueDate, setDueDate] = useState("");
const handleEdit = (task) => {
  setTitle(task.title);
  setAssignedTo(task.assignedTo._id || task.assignedTo);
  setProject(task.project._id || task.project);
  setDueDate(task.dueDate?.split("T")[0]);
  setEditId(task._id);
};
  const fetchTasks = () => {
    API.get("/tasks").then(res => setTasks(res.data));
  };

  const fetchUsers = () => {
    API.get("/auth/users").then(res => setUsers(res.data));
  };

  const fetchProjects = () => {
    API.get("/projects").then(res => setProjects(res.data));
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchProjects();
  }, []);

 const createTask = async () => {
  if (!title || !assignedTo || !project || !dueDate) {
    alert("All fields are required");
    return;
  }

  try {
    if (editId) {
      await API.put(`/tasks/${editId}`, {
        title,
        assignedTo,
        project,
        dueDate
      });
      alert("Task updated");
    } else {
      await API.post("/tasks", {
        title,
        assignedTo,
        project,
        dueDate
      });
      alert("Task created");
    }

    setTitle("");
    setAssignedTo("");
    setProject("");
    setDueDate("");
    setEditId(null);

    fetchTasks();
  } catch {
    alert("Error saving task");
  }
};

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const statusMap = {
    todo: "Pending",
    inprogress: "In Progress",
    done: "Completed"
  };

  const statusColor = {
    todo: "#636e72",
    inprogress: "#e17055",
    done: "#00b894"
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tasks</h2>

      {/* TOP ACTIONS */}
      <div style={styles.topBar}>
        <button style={styles.smallBtn} onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}>Logout</button>

        <button style={styles.smallBtn} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {/* FORM */}
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <select style={styles.input} value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>

        <select style={styles.input} value={project} onChange={e => setProject(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <input
          style={styles.input}
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />

       <button style={styles.addBtn} onClick={createTask}>
  {editId ? "Update Task" : "Add Task"}
</button>
      </div>

      {/* TASK LIST */}
      <div style={styles.taskList}>
        {tasks.map(t => {
          const isOverdue =
            t.dueDate &&
            new Date(t.dueDate).setHours(0,0,0,0) <
            new Date().setHours(0,0,0,0) &&
            t.status !== "done";

          return (
            <div
              key={t._id}
              style={{
                ...styles.taskCard,
                borderLeft: `5px solid ${statusColor[t.status]}`,
                backgroundColor: isOverdue ? "#ffe6e6" : "#fff"
              }}
            >
              <p><b>{t.title}</b></p>

              <p style={{ color: statusColor[t.status] }}>
                Status: {statusMap[t.status]}
              </p>
{user.role === "admin" && (
  <div style={{ marginTop: "10px" }}>
    <button
      style={styles.smallBtn}
      onClick={() => handleEdit(t)}
    >
      Edit
    </button>

    <button
      style={styles.deleteBtn}
      onClick={() => handleDelete(t._id)}
    >
      Delete
    </button>
  </div>
)}
              <p>
                Due: {t.dueDate
                  ? new Date(t.dueDate).toLocaleDateString()
                  : "Not Set"}
              </p>

    
             {user.role === "member" && (
  <div style={styles.statusBtns}>
    <button onClick={() => updateStatus(t._id, "todo")}>Pending</button>
    <button onClick={() => updateStatus(t._id, "inprogress")}>Progress</button>
    <button onClick={() => updateStatus(t._id, "done")}>Done</button>
  </div>
)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f5f6fa",
    minHeight: "100vh",
    fontFamily: "Arial"
  },

  title: {
    textAlign: "center",
    marginBottom: "15px"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px"
  },

  smallBtn: {
    padding: "6px 10px",
    border: "none",
    backgroundColor: "#636e72",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer"
  },

  form: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },

  addBtn: {
    padding: "10px",
    backgroundColor: "#0984e3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  taskCard: {
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },

  statusBtns: {
    display: "flex",
    gap: "5px",
    marginTop: "5px"
  },
  deleteBtn: {
  padding: "6px 10px",
  marginLeft: "10px",
  backgroundColor: "#d63031",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
}
};