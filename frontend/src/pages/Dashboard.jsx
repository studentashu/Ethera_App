import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  const total = tasks.length;
  const todo = tasks.filter(t => t.status === "todo").length;
  const inprogress = tasks.filter(t => t.status === "inprogress").length;
  const done = tasks.filter(t => t.status === "done").length;

  const statusMap = {
    todo: "Pending",
    inprogress: "In Progress",
    done: "Completed"
  };

  const overdue = tasks.filter(
    t =>
      t.dueDate &&
      new Date(t.dueDate).setHours(0,0,0,0) <
      new Date().setHours(0,0,0,0) &&
      t.status !== "done"
  ).length;
const updateStatus = async (id, status) => {
  try {
    await API.put(`/tasks/${id}`, { status });
    const res = await API.get("/tasks"); // refresh
    setTasks(res.data);
  } catch (err) {
    alert("Failed to update status");
  }
};
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard</h2>

      {/* METRICS */}
      <div style={styles.metrics}>
        <div style={styles.card}>Total: {total}</div>
        <div style={styles.card}>Pending: {todo}</div>
        <div style={styles.card}>In Progress: {inprogress}</div>
        <div style={styles.card}>Completed: {done}</div>
        <div style={{ ...styles.card, backgroundColor: "#ffeaa7" }}>
          Overdue: {overdue}
        </div>
        <div><button style={styles.card} onClick={()=>{
            localStorage.removeItem("token");
            navigate("/login");
        }}>Logout</button></div>
      </div>

      {/* ADMIN CONTROLS */}
      {user.role === "admin" && (
        <div style={styles.actions}>
          <button style={styles.button} onClick={() => navigate("/projects")}>
            Projects
          </button>
          <button style={styles.button} onClick={() => navigate("/tasks")}>
            Manage Tasks
          </button>
          <button style={styles.button} onClick={() => navigate("/users")}>
  Manage Users
</button>
        </div>
      )}

      {/* TASK LIST */}
      <h3 style={styles.subtitle}>
        {user.role === "admin" ? "All Tasks" : "My Tasks"}
      </h3>

      <div style={styles.taskList}>
        {tasks.map(t => {
          const isOverdue =
            t.dueDate &&
            new Date(t.dueDate).setHours(0,0,0,0) <
            new Date().setHours(0,0,0,0) &&
            t.status !== "done";

          const statusColor = {
            todo: "#636e72",
            inprogress: "#e17055",
            done: "#00b894"
          };

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

              <p>
                Due:{" "}
                {t.dueDate
                  ? new Date(t.dueDate).toLocaleDateString()
                  : "Not Set"}
              </p>

              {user.role === "admin" && (
                <p>Assigned: {t.assignedTo?.name || "N/A"}</p>
              )}
              {user.role === "member" && (
  <div style={styles.statusBtns}>
    <button onClick={() => updateStatus(t._id, "todo")}>
      Pending
    </button>
    <button onClick={() => updateStatus(t._id, "inprogress")}>
      In Progress
    </button>
    <button onClick={() => updateStatus(t._id, "done")}>
      Completed
    </button>
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
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f6fa",
    minHeight: "100vh"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2f3640"
  },

  metrics: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "20px"
  },

  card: {
    backgroundColor: "#dfe6e9",
    padding: "10px 15px",
    borderRadius: "8px",
    fontWeight: "bold"
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px"
  },

  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0984e3",
    color: "white",
    cursor: "pointer"
  },

  subtitle: {
    marginBottom: "10px",
    textAlign: "center"
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
  }
};