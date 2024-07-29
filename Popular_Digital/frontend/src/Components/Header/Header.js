import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const getBorderStyle = (path) => {
    return pathname === path ? '2px solid blue' : 'none';
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 d-flex flex-row justify-content-between p-4 w-100'>
          <div
            onClick={() => handleNavigation('/adminPage')}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/adminPage') }}
          >
            <p>DASHBOARD</p>
          </div>
          <div
            onClick={() => handleNavigation('/books')}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/books') }}
          >
            <p>BOOKS</p>
          </div>
          <div
            onClick={() => handleNavigation('/members')}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/members') }}
          >
            <p>MEMBERS</p>
          </div>
          <div
            onClick={() => handleNavigation('/borrow')}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/borrow') }}
          >
            <p>BORROWED</p>
          </div>
          <div
            onClick={() => handleNavigation('/reports')}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/reports') }}
          >
            <p>REPORTS</p>
          </div>
          <div
            onClick={handleLogout}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/logout') }}
          >
            <p>LOGOUT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
