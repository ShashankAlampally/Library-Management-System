import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Header from '../../Components/Header/Header';
import UserHeader from '../../Components/UserHeader/UserHeader';

export default function BooksDemo() {
    const API_URL = 'http://shashanks-macbook-air.local:8080/api';
    const emptyBook = {
        id: null,
        title: '',
        author: '',
        genre: '',
        available_copies: 0
    };

    const [books, setBooks] = useState([]);
    const [borrowDialog, setBorrowDialog] = useState(false);
    const [book, setBook] = useState(emptyBook);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        axios.get(`${API_URL}/availableBooks`, { headers: { authorization: sessionStorage.getItem('token') } })
            .then(response => {
                setBooks(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
    }, []);

    const openBorrowDialog = (book) => {
        setBook(book);
        setDueDate(null);
        setBorrowDialog(true);
    };

    const hideBorrowDialog = () => {
        setBorrowDialog(false);
    };

    const borrowBook = () => {
        const memberID = sessionStorage.getItem('userID');
        const bookID = book._id;
        console.log(memberID, bookID);
        const x = new Date(dueDate).toISOString()
        console.log(x);
        if (bookID && memberID) {
            axios.post(`${API_URL}/borrowBook`, { bookID, memberID, dueDate: new Date(dueDate).toISOString() }, { headers: { authorization: sessionStorage.getItem('token') } })
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Book Borrowed', life: 3000 });
                    setBooks(books.map(b => b._id === bookID ? { ...b, available_copies: b.available_copies - 1 } : b));
                    hideBorrowDialog();
                })
                .catch(error => {
                    console.error('Error borrowing book:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Could not borrow book', life: 3000 });
                });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select a due date', life: 3000 });
        }
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={getStatus(rowData.available_copies)} severity={getSeverity(rowData)}></Tag>;
    };

    const getStatus = (quantity) => {
        if (quantity > 10) return 'INSTOCK';
        if (quantity > 0) return 'LOWSTOCK';
        return 'OUTOFSTOCK';
    };

    const getSeverity = (book) => {
        switch (getStatus(book.available_copies)) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return null;
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button label="Borrow" icon="pi pi-book" className="p-button-rounded p-button-success p-button-text" onClick={() => openBorrowDialog(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Available Books</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const borrowDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideBorrowDialog} />
            <Button label="Borrow" icon="pi pi-check" onClick={borrowBook} />
        </React.Fragment>
    );

    return (
        <div>
            <UserHeader />
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" />

                <DataTable
                    value={books}
                    dataKey="_id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column field="title" header="Title" sortable></Column>
                    <Column field="author" header="Author" sortable></Column>
                    <Column field="genre" header="Genre" sortable></Column>
                    <Column field="available_copies" header="Stock" body={statusBodyTemplate} sortable></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={borrowDialog} style={{ width: '450px' }} header="Borrow Book" modal className="p-fluid" footer={borrowDialogFooter} onHide={hideBorrowDialog}>
                <div className="field">
                    <label htmlFor="title">Title</label>
                    <InputText id="title" value={book.title} disabled />
                </div>
                <div className="field">
                    <label htmlFor="author">Author</label>
                    <InputText id="author" value={book.author} disabled />
                </div>
                <div className="field">
                    <label htmlFor="genre">Genre</label>
                    <InputText id="genre" value={book.genre} disabled />
                </div>
                <div className="field">
                    <label htmlFor="dueDate">Due Date</label>
                    <Calendar id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.value)} showIcon />
                </div>
            </Dialog>
        </div>
    );
}
