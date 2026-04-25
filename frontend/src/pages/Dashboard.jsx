import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { useToast } from '../hooks';
import { api } from '../api';
import { Header } from '../components/Header';
import { DemoAnnouncement } from '../components/DemoAnnouncement';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks(user.token);
      setTasks(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      addToast('Task title cannot be empty', 'error');
      return;
    }

    setSubmitting(true);

    try {
      await api.createTask(user.token, newTaskTitle, newTaskDesc);
      setNewTaskTitle('');
      setNewTaskDesc('');
      addToast('Task created!', 'success');
      loadTasks();
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await api.deleteTask(user.token, taskId);
      addToast('Task deleted', 'success');
      loadTasks();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Header />
      <DemoAnnouncement />

      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>My Tasks</h1>
            <p>Keep track of what you need to do</p>
          </div>

          <div className="dashboard-content">
            <form onSubmit={handleAddTask} className="task-form">
              <div className="form-row">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="task-input"
                  disabled={submitting}
                />
                <button
                  type="submit"
                  className="btn-add"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : '+ Add'}
                </button>
              </div>

              <textarea
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Description"
                className="task-description"
                disabled={submitting}
              />
            </form>

            <div className="tasks-container">
              {loading ? (
                <div className="loading">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✨</div>
                  <p>No tasks yet. Create your first one!</p>
                </div>
              ) : (
                <div className="tasks-list">
                  {tasks.map((task) => (
                    <div key={task.id} className="task-item">
                      <div className="task-content">
                        <h3>{task.title}</h3>
                        {task.description && <p>{task.description}</p>}
                        <small className="task-meta">
                          Created: {new Date(task.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="btn-delete"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
