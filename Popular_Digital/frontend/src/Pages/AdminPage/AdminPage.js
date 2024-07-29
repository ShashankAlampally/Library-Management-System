import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../Components/Header/Header';
import Item from '../../Components/DashboardItem/Item';

const AdminPage = () => {
  const [borrowCount, setBorrowCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [returnCount, setReturnCount] = useState(0);

  const headers = sessionStorage.getItem('token')


  useEffect(() => {
    // Fetch borrow count
    axios.get('http://shashanks-macbook-air.local:8080/api/borrowedBooks', { headers: {
        authorization: sessionStorage.getItem('token')
    } })
      .then(response => {
        setBorrowCount(response.data.data.length);
      })
      .catch(error => {
        console.error('There was an error fetching the borrow count!', error);
      });

    // Fetch total books count
    axios.get('http://shashanks-macbook-air.local:8080/api/viewBooks', { headers: {
        authorization: sessionStorage.getItem('token')
    } })
      .then(response => {
        setBookCount(response.data.data.length);
      })
      .catch(error => {
        console.error('There was an error fetching the total books count!', error);
      });

    // Fetch total number of users
    axios.get('http://shashanks-macbook-air.local:8080/api/allUsers', { headers: {
        authorization: sessionStorage.getItem('token')
    } })
      .then(response => {
        setUserCount(response.data.data.length);
      })
      .catch(error => {
        console.error('There was an error fetching the total number of users!', error);
      });

    // Fetch total number of returned books
    axios.get('http://shashanks-macbook-air.local:8080/api/returnedBooks', { headers: {
        authorization: sessionStorage.getItem('token')
    } })
      .then(response => {
        setReturnCount(response.data.data.length);
      })
      .catch(error => {
        console.error('There was an error fetching the total number of returned books!', error);
      });
  }, []);

  return (
    <div>
      <Header />
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
                name={`Total Books :${bookCount} `}
                data={
                  <>
                    <img width="64" height="64" src="https://img.icons8.com/ios/64/books.png" alt="books" />
                  </>
                }
              />
            </div>
            <div className='col-4 mt-5'>
              <Item 
                name={`Total Users : ${userCount}`}
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
            <div className='col-4 mt-5'>
              <Item 
                name="Reports"
                data={<img width="64" height="64" src="https://img.icons8.com/ios/64/graph-report.png" alt="graph-report" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
