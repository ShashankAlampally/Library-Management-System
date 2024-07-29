import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import UserHeader from '../../Components/UserHeader/UserHeader';

export default function BooksDemo() {
    const API_URL = 'http://shashanks-macbook-air.local:8080/api';
    const [books, setBooks] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const headers = {
        authorization: sessionStorage.getItem('token'),
      };
      useEffect(() => {
        const userID = sessionStorage.getItem('userID');
        console.log(headers);
        axios.post(`${API_URL}/returnedBooks`, 
            {
                memberID: userID
            }, 
            {
                headers: headers
            }
        )
        .then(response => {
            setBooks(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching returned books:', error);
        });
    }, []);
    

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const dueDateBodyTemplate = (rowData) => {
        return (
            <div>
                {formatDate(rowData.dueDate)}
            </div>
        );
    };

    const fineBodyTemplate = (rowData) => {
        return <div>₹{rowData.fine}</div>;
    };

    const returnDateBodyTemplate = (rowData) => {
        return <div>{formatDate(rowData.returnDate)}</div>;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Returned Books</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <div>
            <UserHeader />
            <Toast ref={toast} />
            <div className="card">
                <DataTable
                    value={books}
                    dataKey="_id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column field="bookID.title" header="Title" sortable></Column>
                    <Column field="bookID.author" header="Author" sortable></Column>
                    <Column field="bookID.genre" header="Genre" sortable></Column>
                    <Column field="borrowDate" header="Borrowed Date" body={(rowData) => formatDate(rowData.borrowDate)} sortable></Column>
                    <Column field="dueDate" header="Due Date" body={dueDateBodyTemplate} sortable></Column>
                    <Column field="returnDate" header="Return Date" body={returnDateBodyTemplate} sortable></Column>
                    <Column header="Fine" body={fineBodyTemplate} sortable></Column>
                </DataTable>
            </div>
        </div>
    );
}
