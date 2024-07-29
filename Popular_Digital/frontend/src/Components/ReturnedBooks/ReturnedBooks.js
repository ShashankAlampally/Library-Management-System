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

export default function ReturnedBooks() {
    const [returnedBooks, setReturnedBooks] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        axios.get('http://shashanks-macbook-air.local:8080/api/returnedBooks', {
            headers: {
                authorization: sessionStorage.getItem('token')
            }
        })
        .then(response => {
            setReturnedBooks(response.data.data);
        })
        .catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch returned books', life: 3000 });
        });
    }, []);

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Returned Books</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const formatFines = (fine) => {
        return fine !== undefined && fine !== null ? `₹${fine.toFixed(2)}` : `$0.00`;
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable ref={dt} value={returnedBooks} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column field="bookID.title" header="Book Title" sortable></Column>
                    <Column field="memberID.name" header="Member Name" sortable></Column>
                    <Column field="dueDate" header="Due Date" body={(rowData) => new Date(rowData.dueDate).toLocaleDateString()} sortable></Column>
                    <Column field="borrowDate" header="Borrow Date" body={(rowData) => new Date(rowData.borrowDate).toLocaleDateString()} sortable></Column>
                    <Column field="memberID.phone_number" header="Member Phone Number" sortable></Column>
                    <Column field="returnDate" header="Return Date" body={(rowData) => new Date(rowData.returnDate).toLocaleDateString()} sortable></Column>
                    <Column field="fine" header="Fines" body={(rowData) => formatFines(rowData.fine)} sortable></Column>
                </DataTable>
            </div>
        </div>
    );
}
