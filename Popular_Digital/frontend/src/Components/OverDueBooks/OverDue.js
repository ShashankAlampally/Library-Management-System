import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css'; // or another theme of your choice
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons
import 'primeflex/primeflex.css'; // PrimeFlex CSS

export default function OverdueBooks() {
    const API_URL = 'http://shashanks-macbook-air.local:8080/api';
    const [overdueBooks, setOverdueBooks] = useState([]);
    const [fines, setFines] = useState({});
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        axios.get(`${API_URL}/overdueBooks`, {
            headers: {
                authorization: sessionStorage.getItem('token')
            }
        })
        .then(response => {
            const overdueBooksData = response.data.data;
            setOverdueBooks(overdueBooksData);
            fetchFines(overdueBooksData);
        })
        .catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch overdue books', life: 3000 });
        });
    }, []);

    const fetchFines = (overdueBooks) => {
        const finesData = {};
        

        const requests = overdueBooks.map(book =>
            axios.post(`${API_URL}/calculateFineByID`, { memberID:book.memberID._id, bookID: book.bookID._id }, { headers: { authorization: sessionStorage.getItem('token') } })
                .then(response => {
                    finesData[book.bookID._id] = response.data.data.fine;
                })
                .catch(error => {
                    console.error('Error fetching fines:', error);
                })
        );

        Promise.all(requests).then(() => {
            setFines(finesData);
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const fineBodyTemplate = (rowData) => {
        const fine = fines[rowData.bookID._id] || 0;
        return <div>₹{fine}</div>;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Overdue Books</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable ref={dt} value={overdueBooks} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column field="bookID.title" header="Book Title" sortable></Column>
                    <Column field="memberID.name" header="Member Name" sortable></Column>
                    <Column field="dueDate" header="Due Date" body={(rowData) => formatDate(rowData.dueDate)} sortable></Column>
                    <Column field="borrowDate" header="Borrow Date" body={(rowData) => formatDate(rowData.borrowDate)} sortable></Column>
                    <Column field="memberID.phone_number" header="Member Phone Number" sortable></Column>
                    <Column header="Fine" body={fineBodyTemplate} sortable></Column>
                </DataTable>
            </div>
        </div>
    );
}
