import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserHeader = () => {
  

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userID')
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
            onClick={() => handleNavigation('/UserPage')}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/UserPage') }}
          >
            <p>DASHBOARD</p>
          </div>
          <div
            onClick={() => handleNavigation('/available')}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/available') }}
          >
            <p>Availabe Books</p>
          </div>
          <div
            onClick={() => handleNavigation('/borrowed')}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/borrowed') }}
          >
            <p>Books Borrowed</p>
          </div>
          <div
            onClick={() => handleNavigation('/returned')}
            style={{ cursor: 'pointer', borderBottom: getBorderStyle('/returned') }}
          >
            <p>Books Returned</p>
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


export default UserHeader