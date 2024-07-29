import { Routes,Route , Navigate} from 'react-router-dom';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import UserPage from './Pages/UserPage/UserPage';
import Admin from './Pages/AdminLogin/Admin';
import AdminPage from './Pages/AdminPage/AdminPage';
import Books from './Pages/Books/Books';
import Borrowed from './Pages/Borrowed/Borrowed';
import Reports from './Pages/Reports/Reports';
import Members from './Pages/Members/Members';
import Available from './Pages/Available/Available';
import UserBorrow from './Pages/UserBorrow/UserBorrow';
import UserReturned from './Pages/UserReturned/UserReturned';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path='/' element={<Navigate to="/login"/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/UserPage' element={<UserPage/>} />
          <Route path='/adminLogin' element={<Admin/>} />
          <Route path='/adminPage' element={<AdminPage/>} />
          <Route path='/books' element={<Books/>} />
          <Route path='/members' element={<Members/>} />
          <Route path='/borrow' element={<Borrowed/>} />
          <Route path='/reports' element={<Reports/>} />
          <Route path='/available' element={<Available/>} />
          <Route path='/borrowed' element={<UserBorrow/>} />
          <Route path='/returned' element={<UserReturned/>} />

      </Routes>
    </div>
  );
}

export default App;
