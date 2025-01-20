import React, { useState, useEffect } from 'react';
import Table from '../Reusable/Table.tsx';
import AddInvoice from './AddInvoice.tsx';

const Invoices = () => {
    const [invoices, setInvoices] = useState<any>([]);
    const [services, setServices] = useState<any>([]);
    const [showCreateInvoice, setShowCreateInvoice] = useState(false);

    //fetch invoices and services from api calls
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const invoicesResponse = await fetch('http://localhost:3000/api/invoices', {
                    headers: { Authorization : `Bearer ${token}`}
                });
                const servicesResponse = await fetch('http://localhost:3000/api/services', {
                    headers: { Authorization : `Bearer ${token}`}
                });

                if (!invoicesResponse.ok || !servicesResponse.ok) {
                    throw new Error ('Failed to fetch data')
                }

                const invoicesData = await invoicesResponse.json()
                const servicesData = await servicesResponse.json()

                setInvoices(invoicesData)
                setServices(servicesData)

                
            }catch(error){
                console.error('Error fetching data:', error)
            }
        };

        fetchData();

    }, [])

    // functionality for deleting an item
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch (`http://localhost:3000/api/invoices/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
        });

        if (response.ok) {
            setInvoices(prevData => prevData.filter (item => item.id !== id))
        }else{
            console.error ("Failed to delete item")
        }
    }

     // functionality for adding an invoice to the database
     const handleGenerate = async (newInvoice) => {
        const token = localStorage.getItem('token');
        const response = await fetch ('http://localhost:3000/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                       'Authorization': `Bearer ${token}`},
            body: JSON.stringify(newInvoice)
        });

        if (response.ok) {
            const addedInvoice = await response.json();

            const formattedInvoice = {
                ...addedInvoice,
                services: addedInvoice.services.map((service) => ({
                    ...service,
                    service: service.service
                }))
            }
            console.log('formattedInvoice:',formattedInvoice)

            setInvoices([...invoices, formattedInvoice]);
        }else {
            throw new Error("Error adding item")
        }
    }

    //define columns
    const columns = [
        { header: 'Patient Name', accessor: 'patientName'},
        { header: 'Services', accessor: 'services'},
        { header: 'Payment Type', accessor: 'paymentType'},
        { header: 'Total Amount', accessor: 'totalAmount'},
        { header: 'Date', accessor: 'createdAt'}
    ];

    return (
        
        <div className='table-container'>
            {!showCreateInvoice && (
                <>
                    <h2>Invoices</h2>
                    <div className='add-button-container'>
                        <button onClick={() => setShowCreateInvoice(true)}>Add Invoice</button>
                    </div>
                    <Table columns={columns} data={invoices} onDelete={handleDelete} onEdit={null}/>
                </>
            )}
            {showCreateInvoice && 
            <div>
                 <AddInvoice onClose = {() => setShowCreateInvoice(false)} services = {services} onGenerate = {handleGenerate}/>
            </div>}
        </div>
    )


}

export default Invoices

