import React, { useState, useEffect } from 'react';
import Table from '../Reusable/Table.tsx';
import AddInvoice from './AddInvoice.tsx';

const Invoices = () => {
    const [invoices, setInvoices] = useState<any>([]);
    const [services, setServices] = useState<any>([]);
    const [showCreateInvoice, setShowCreateInvoice] = useState(false);
    const [filterMonth, setFilterMonth] = useState<any>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<any>([]);

    const URL = 'https://begonia-medical.onrender.com';


    //fetch invoices and services from api calls
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const invoicesResponse = await fetch(`${URL}/api/invoices`, {
                    headers: { Authorization : `Bearer ${token}`}
                });
                const servicesResponse = await fetch(`${URL}/api/services`, {
                    headers: { Authorization : `Bearer ${token}`}
                });

                if (!invoicesResponse.ok || !servicesResponse.ok) {
                    throw new Error ('Failed to fetch data')
                }

                const invoicesData = await invoicesResponse.json()
                const servicesData = await servicesResponse.json()

                setInvoices(invoicesData)
                setServices(servicesData)
                setFilteredInvoices (invoicesData)

                
            }catch(error){
                console.error('Error fetching data:', error)
            }
        };

        fetchData();

    }, [])

  
    // functionality for deleting an item
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch (`${URL}/api/invoices/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
        });

        if (response.ok) {
            setInvoices(prevData => prevData.filter (item => item.id !== id))
            setFilteredInvoices(prevData => prevData.filter(item => item.id !== id));
        }else{
            console.error ("Failed to delete item")
        }
    }

     // functionality for adding an invoice to the database
     const handleGenerate = async (newInvoice) => {
        const token = localStorage.getItem('token');
        const response = await fetch (`${URL}/api/invoices`, {
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
            // console.log('formattedInvoice:',formattedInvoice)

            setInvoices([...invoices, formattedInvoice]);
            setFilteredInvoices(prevFiltered => [...prevFiltered, formattedInvoice]);

        }else {
            throw new Error("Error adding item")
        }
    }

    const handleFilterByMonth = (month: string) => {
        setFilterMonth(month);
        if (month){
            const filtered = invoices.filter((invoice) => {
                const invoiceDate = new Date((invoice.createdAt))
                return invoiceDate.getMonth().toString() === month;
            })
            setFilteredInvoices(filtered)
        } else {
            setFilteredInvoices(invoices)
        }
        
    }

    const calculateTotals = () => {
        const totals = {
            Cash: 0,
            'Credit Card': 0,
            Linx: 0,
            GrandTotal: 0
        }

        filteredInvoices.forEach ((invoice) => {
            const { paymentType, totalAmount} = invoice;
            
            if (paymentType in totals) {
                totals[paymentType] += totalAmount;
            }

            totals.GrandTotal += totalAmount;
        })
        return totals
    }

    const totals = calculateTotals()

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
                    <div className='filter-summary-container'>
                        <div className='revenueSummary'>
                            <h3>Revenue Summary</h3>
                            <p>Cash: ${totals.Cash}</p>
                            <p>Credit Card: ${totals['Credit Card']}</p>
                            <p>Linx: ${totals.Linx}</p>
                            <p>Grand Total: ${totals.GrandTotal}</p>
                        </div>
                        <div className='filter-container'>
                            <label htmlFor='monthFilter'>Filter by Month:</label>
                            <select id= 'monthFilter' value = {filterMonth} onChange={(e) => handleFilterByMonth(e.target.value)}>
                                <option value="">All</option>
                                <option value="0">January</option>
                                <option value="1">February</option>
                                <option value="2">March</option>
                                <option value="3">April</option>
                                <option value="4">May</option>
                                <option value="5">June</option>
                                <option value="6">July</option>
                                <option value="7">August</option>
                                <option value="8">September</option>
                                <option value="9">October</option>
                                <option value="10">November</option>
                                <option value="11">December</option>
                            </select >
                        </div>
                        
                    </div>

                    <div className='add-button-container'>
                        <button onClick={() => setShowCreateInvoice(true)}>Add Invoice</button>
                    </div>

                    <Table columns={columns} data={filteredInvoices} onDelete={handleDelete} onEdit={null}/>
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

