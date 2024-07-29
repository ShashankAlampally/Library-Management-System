import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext'; // Add this line
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css'; // or another theme of your choice
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons
import 'primeflex/primeflex.css'; // PrimeFlex CSS
import Header from '../../Components/Header/Header';

export default function MembersDemo() {

    let emptyMember = {
        id: null,
        name: '',
        email: '',
        address: '',
        phone_number: ''
    };

    const [members, setMembers] = useState([]);
    const [deleteMemberDialog, setDeleteMemberDialog] = useState(false);
    const [member, setMember] = useState(emptyMember);
    const [selectedMembers, setSelectedMembers] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        // Fetch members from the backend
        fetch('http://shashanks-macbook-air.local:8080/api/allUsers', {
            headers: {
                authorization: sessionStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => setMembers(data.data));
    }, [members]);

    const hideDeleteMemberDialog = () => {
        setDeleteMemberDialog(false);
    };

    const confirmDeleteMember = (member) => {
        setMember(member);
        setDeleteMemberDialog(true);
    };

    const deleteMember = () => {
        fetch('http://shashanks-macbook-air.local:8080/api/deleteUser', {
            method: 'DELETE',
            headers: {
                authorization: sessionStorage.getItem('token')
            },
            body: JSON.stringify({ email: member.email })
        })
        .then(response => response.json())
        .then(() => {
            let _members = members.filter(val => val.id !== member.id);
            setMembers(_members);
            setDeleteMemberDialog(false);
            setMember(emptyMember);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Member Deleted', life: 3000 });
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => confirmDeleteMember(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Members</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteMemberDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteMemberDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteMember} />
        </React.Fragment>
    );

    return (
        <div>
            <Header/>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4"></Toolbar>

                <DataTable ref={dt} value={members} selection={selectedMembers} onSelectionChange={(e) => setSelectedMembers(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="name" header="Name" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
                    <Column field="address" header="Address" sortable></Column>
                    <Column field="phone_number" header="Phone Number" sortable></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ width: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={deleteMemberDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMemberDialogFooter} onHide={hideDeleteMemberDialog}>
                <div className="flex align-items-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }}></i>
                    {member && <span>Are you sure you want to delete the member <b>{member.name}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}
