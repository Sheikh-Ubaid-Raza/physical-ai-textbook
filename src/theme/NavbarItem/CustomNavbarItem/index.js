import React, { useContext } from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import { AuthContext } from '../../../../contexts/AuthContext';
import './styles.css';

const CustomNavbarItem = (props) => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const handleSignIn = () => {
    // For now, we'll just show an alert
    // In a real implementation, this would open the auth modal
    alert('Sign in functionality would open here');
  };

  // Only show on non-landing pages or show sign in everywhere but handle differently
  return (
    <div className={clsx('navbar__item', 'custom-navbar-item')}>
      {user ? (
        <button
          className="navbar-auth-button logout"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          🚪
        </button>
      ) : (
        <button
          className="navbar-auth-button signin"
          onClick={handleSignIn}
          title="Sign In"
          aria-label="Sign In"
        >
          🔐
        </button>
      )}
    </div>
  );
};

export default React.memo(CustomNavbarItem);