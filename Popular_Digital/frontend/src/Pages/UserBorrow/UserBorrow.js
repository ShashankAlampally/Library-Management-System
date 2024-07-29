import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
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
    const [fines, setFines] = useState({});
    const [borrowDialog, setBorrowDialog] = useState(false);
    const [book, setBook] = useState(emptyBook);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        axios.post(`${API_URL}/borrowedBooks`, { memberID: sessionStorage.getItem('userID') }, { headers: { authorization: sessionStorage.getItem('token') } })
            .then(response => {
                const borrowedBooks = response.data.data;
                setBooks(borrowedBooks);
                fetchFines(borrowedBooks);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
    }, []);

    const fetchFines = (borrowedBooks) => {
        const finesData = {};
        const memberID = sessionStorage.getItem('userID');

        const requests = borrowedBooks.map(book =>
            axios.post(`${API_URL}/calculateFineByID`, { memberID, bookID: book.bookID._id }, { headers: { authorization: sessionStorage.getItem('token') } })
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

    const openBorrowDialog = (book) => {
        setBook(book.bookID); // Access bookID property
        setBorrowDialog(true);
    };

    const hideBorrowDialog = () => {
        setBorrowDialog(false);
    };

    const borrowBook = () => {
        const memberID = sessionStorage.getItem('userID');
        const bookID = book._id;

        if (bookID && memberID) {
            axios.post(`${API_URL}/returnBook`, { bookID, memberID }, { headers: { authorization: sessionStorage.getItem('token') } })
                .then(response => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Book Returned', life: 3000 });
                    setBooks(books.filter(b => b.bookID._id !== bookID));
                    hideBorrowDialog();
                })
                .catch(error => {
                    console.error('Error returning book:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Could not return book', life: 3000 });
                });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select a due date', life: 3000 });
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const dueDateBodyTemplate = (rowData) => {
        const dueDate = new Date(rowData.dueDate);
        const today = new Date();
        const isOverdue = dueDate <= today;

        const style = {
            border: `2px solid ${isOverdue ? 'red' : 'green'}`,
            padding: '0.5rem',
            borderRadius: '4px'
        };

        return (
            <div style={style}>
                {formatDate(rowData.dueDate)}
            </div>
        );
    };

    const fineBodyTemplate = (rowData) => {
        const fine = fines[rowData.bookID._id] || 0;
        return <div>{fine}</div>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button label="Return" icon="pi pi-undo" className="p-button-rounded p-button-success p-button-text" onClick={() => openBorrowDialog(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Borrowed Books</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const borrowDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideBorrowDialog} />
            <Button label="Return" icon="pi pi-check" onClick={borrowBook} />
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
                    <Column field="bookID.title" header="Title" sortable></Column>
                    <Column field="bookID.author" header="Author" sortable></Column>
                    <Column field="bookID.genre" header="Genre" sortable></Column>
                    <Column field="borrowDate" header="Borrowed Date" body={(rowData) => formatDate(rowData.borrowDate)} sortable></Column>
                    <Column field="dueDate" header="Due Date" body={dueDateBodyTemplate} sortable></Column>
                    <Column header="Fine" body={fineBodyTemplate} sortable></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={borrowDialog} style={{ width: '450px' }} header="Return Book" modal className="p-fluid" footer={borrowDialogFooter} onHide={hideBorrowDialog}>
                <div className="field">
                    <label htmlFor="title">Title</label>
                    <InputText id="title" value={book ? book.title : ''} disabled />
                </div>
                <div className="field">
                    <label htmlFor="author">Author</label>
                    <InputText id="author" value={book ? book.author : ''} disabled />
                </div>
                <div className="field">
                    <label htmlFor="genre">Genre</label>
                    <InputText id="genre" value={book ? book.genre : ''} disabled />
                </div>
            </Dialog>
        </div>
    );
}
