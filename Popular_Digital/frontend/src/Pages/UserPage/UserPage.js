import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../Components/Header/Header';
import Item from '../../Components/DashboardItem/Item';
import UserHeader from '../../Components/UserHeader/UserHeader';

const AdminPage = () => {
  const [borrowCount, setBorrowCount] = useState(0);
  const [returnCount, setReturnCount] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const memberID = sessionStorage.getItem('userID');
    const headers = {
      authorization: token,
    };

    // Fetch borrow count
    axios.post('http://shashanks-macbook-air.local:8080/api/borrowedBooks', { memberID }, { headers })
      .then(response => {
        setBorrowCount(response.data.data.length);
      })
      .catch(error => {
        console.error('There was an error fetching the borrow count!', error);
      });

    // Fetch total number of returned books
    axios.post('http://shashanks-macbook-air.local:8080/api/returnedBooks', { memberID }, { headers })
      .then(response => {
        setReturnCount(response.data.data.length);
      })
      .catch(error => {
        console.error('There was an error fetching the total number of returned books!', error);
      });
  }, []);

  return (
    <div>
      <UserHeader />
      <div className='container-fluid'>
        <div className='row d-flex flex-column align-content-around' style={{ height: '100vh' }}>
          <div className='d-flex flex-row justify-content-around'>
            <div className='col-4 mt-5'>
              <Item 
                name={`Borrowed Books : ${borrowCount}`}
                data={
                  <>
                    <img width="64" height="64" src="https://img.icons8.com/wired/64/borrow-book.png" alt="borrow-book" />
                  </>
                }
              />
            </div>
            <div className='col-4 mt-5'>
              <Item 
                name={"Profile"}
                data={
                  <>
                    <img width="64" height="64" src="https://img.icons8.com/ios/64/conference-call--v1.png" alt="conference-call--v1" />
                  </>
                }
              />
            </div>
          </div>
          <div className='d-flex flex-row justify-content-around'>
            <div className='col-4 mt-5'>
              <Item 
                name={`Return Count : ${returnCount}`}
                data={
                  <>
                    <img width="64" height="64" src="https://img.icons8.com/wired/64/return-book.png" alt="return-book" />
                  </>
                }
              />
            </div>
            <div className='col-4 mt-5'>
              <Item 
                name="Available Books"
                data={<img width="64" height="64" src="https://img.icons8.com/external-outline-black-m-oki-orlando/64/external-available-stock-supply-chain-management-outline-outline-black-m-oki-orlando.png" alt="external-available-stock-supply-chain-management-outline-outline-black-m-oki-orlando" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
