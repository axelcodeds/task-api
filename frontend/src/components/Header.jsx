import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { useToast } from '../hooks';
import { api } from '../api';
import './Header.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('⚠️ This will permanently delete your account and all data. Are you sure?')) {
      return;
    }

    try {
      await api.deleteUser(user.token, user.id);
      logout();
      addToast('Account deleted', 'success');
      navigate('/login');
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">✓</span>
          <span className="logo-text">Task API</span>
        </div>

        <div className="header-user">
          <div className="user-email">{user?.email}</div>
          <button
            className="user-menu-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            ⋮
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="dropdown-item logout">
                Log Out
              </button>
              <button onClick={handleDeleteAccount} className="dropdown-item delete">
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
