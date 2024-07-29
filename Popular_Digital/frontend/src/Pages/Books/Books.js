import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import Axios
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css'; // or another theme of your choice
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons
import 'primeflex/primeflex.css'; // PrimeFlex CSS
import Header from '../../Components/Header/Header';

export default function BooksDemo() {
    const API_URL = 'http://shashanks-macbook-air.local:8080/api';

    let emptyBook = {
        id: null,
        ISBN: '',
        title: '',
        author: '',
        genre: '',
        description: '',
        available_copies: 0
    };

    const [books, setBooks] = useState([]);
    const [bookDialog, setBookDialog] = useState(false);
    const [deleteBookDialog, setDeleteBookDialog] = useState(false);
    const [deleteBooksDialog, setDeleteBooksDialog] = useState(false);
    const [book, setBook] = useState(emptyBook);
    const [selectedBooks, setSelectedBooks] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        // Fetch books from the backend
        axios.get(`${API_URL}/viewBooks`, { headers: {
            authorization: sessionStorage.getItem('token')
        } })
            .then(response => {
                setBooks(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
    }, [books]);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setBook(emptyBook);
        setSubmitted(false);
        setBookDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBookDialog(false);
    };

    const hideDeleteBookDialog = () => {
        setDeleteBookDialog(false);
    };

    const hideDeleteBooksDialog = () => {
        setDeleteBooksDialog(false);
    };

    const saveBook = () => {
        setSubmitted(true);

        if (book.title.trim() && book.ISBN.trim()) {
            let _books = [...books];
            let _book = { ...book };

            if (book.id) {
                // Update book
                axios.put(`${API_URL}/updateBook`, _book, { headers: {
                    authorization: sessionStorage.getItem('token')
                } })
                    .then(() => {
                        _books = _books.map(b => b.id === book.id ? _book : b);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Book Updated', life: 3000 });
                    })
                    .catch(error => {
                        console.error('Error updating book:', error);
                    });
            } else {
                // Add new book
                axios.post(`${API_URL}/addBook`, _book, { headers: {
                    authorization: sessionStorage.getItem('token')
                } })
                    .then(response => {
                        _book.id = response.data.data._id;
                        _books.push(_book);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Book Created', life: 3000 });
                    })
                    .catch(error => {
                        console.error('Error adding book:', error);
                    });
            }

            setBooks(_books);
            setBook(emptyBook);
            setBookDialog(false);
        }
    };

    const editBook = (book) => {
        setBook({ ...book });
        setBookDialog(true);
    };

    const confirmDeleteBook = (book) => {
        setBook(book);
        setDeleteBookDialog(true);
    };

    const deleteBook = () => {
        axios.delete(`${API_URL}/deleteBook`, { headers: {
            authorization: sessionStorage.getItem('token')
        }, data: { ISBN: book.ISBN } })
            .then(() => {
                let _books = books.filter(val => val.ISBN !== book.ISBN);
                setBooks(_books);
                setDeleteBookDialog(false);
                setBook(emptyBook);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Book Deleted', life: 3000 });
            })
            .catch(error => {
                console.error('Error deleting book:', error);
            });
    };

    const confirmDeleteSelected = () => {
        setDeleteBooksDialog(true);
    };

    const deleteSelectedBooks = () => {
        let promises = selectedBooks.map(book => 
            axios.delete(`${API_URL}/deleteBook`, { headers: {
                authorization: sessionStorage.getItem('token')
            }, data: { ISBN: book.ISBN } })
        );

        Promise.all(promises)
            .then(() => {
                let _books = books.filter((val) => !selectedBooks.some(selectedBook => selectedBook.ISBN === val.ISBN));
                setBooks(_books);
                setDeleteBooksDialog(false);
                setSelectedBooks(null);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Books Deleted', life: 3000 });
            })
            .catch(error => {
                console.error('Error deleting selected books:', error);
            });
    };

    const getStatus = (available_copies) => {
        if (available_copies > 10) return 'INSTOCK';
        if (available_copies > 0) return 'LOWSTOCK';
        return 'OUTOFSTOCK';
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={getStatus(rowData.available_copies)} severity={getSeverity(rowData)}></Tag>;
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-text" onClick={() => editBook(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => confirmDeleteBook(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Books</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const bookDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveBook} />
        </React.Fragment>
    );

    const deleteBookDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteBookDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteBook} />
        </React.Fragment>
    );

    const deleteBooksDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteBooksDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedBooks} />
        </React.Fragment>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedBooks || !selectedBooks.length} />
            </div>
        );
    };

    return (
        <div>
            <Header />
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable
                    ref={dt}
                    value={books}
                    selection={selectedBooks}
                    onSelectionChange={(e) => setSelectedBooks(e.value)}
                    dataKey="ISBN"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    className="datatable-responsive"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="ISBN" header="ISBN" sortable></Column>
                    <Column field="title" header="Title" sortable></Column>
                    <Column field="author" header="Author" sortable></Column>
                    <Column field="genre" header="Genre" sortable></Column>
                    <Column field="available_copies" header="Stock" sortable body={statusBodyTemplate}></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
                <Dialog
                    visible={bookDialog}
                    style={{ width: '450px' }}
                    header="Book Details"
                    modal
                    className="p-fluid"
                    footer={bookDialogFooter}
                    onHide={hideDialog}
                >
                    <div className="field">
                        <label htmlFor="ISBN">ISBN</label>
                        <InputText
                            id="ISBN"
                            value={book.ISBN}
                            onChange={(e) => setBook({ ...book, ISBN: e.target.value })}
                            required
                            autoFocus
                            className={classNames({ 'p-invalid': submitted && !book.ISBN })}
                        />
                        {submitted && !book.ISBN && <small className="p-error">ISBN is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="title">Title</label>
                        <InputText
                            id="title"
                            value={book.title}
                            onChange={(e) => setBook({ ...book, title: e.target.value })}
                            required
                            className={classNames({ 'p-invalid': submitted && !book.title })}
                        />
                        {submitted && !book.title && <small className="p-error">Title is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="author">Author</label>
                        <InputText
                            id="author"
                            value={book.author}
                            onChange={(e) => setBook({ ...book, author: e.target.value })}
                            required
                            className={classNames({ 'p-invalid': submitted && !book.author })}
                        />
                        {submitted && !book.author && <small className="p-error">Author is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="genre">Genre</label>
                        <InputText
                            id="genre"
                            value={book.genre}
                            onChange={(e) => setBook({ ...book, genre: e.target.value })}
                            required
                            className={classNames({ 'p-invalid': submitted && !book.genre })}
                        />
                        {submitted && !book.genre && <small className="p-error">Genre is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="available_copies">Quantity</label>
                        <InputNumber
                            id="available_copies"
                            value={book.available_copies}
                            onValueChange={(e) => setBook({ ...book, available_copies: e.value })}
                            required
                            className={classNames({ 'p-invalid': submitted && book.available_copies === 0 })}
                        />
                        {submitted && book.available_copies === 0 && <small className="p-error">available_copies is required.</small>}
                    </div>
                </Dialog>
                <Dialog
                    visible={deleteBookDialog}
                    style={{ width: '450px' }}
                    header="Confirm"
                    modal
                    footer={deleteBookDialogFooter}
                    onHide={hideDeleteBookDialog}
                >
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {book && (
                            <span>
                                Are you sure you want to delete <b>{book.title}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
                <Dialog
                    visible={deleteBooksDialog}
                    style={{ width: '450px' }}
                    header="Confirm"
                    modal
                    footer={deleteBooksDialogFooter}
                    onHide={hideDeleteBooksDialog}
                >
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {selectedBooks && <span>Are you sure you want to delete the selected books?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    );
}
