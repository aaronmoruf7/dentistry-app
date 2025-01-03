import React, { useState, useEffect } from 'react';
import Table from './Table.tsx';

const Inventory = () => {
    const [inventoryData, setInventoryData] = useState<any[]>([]);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/inventory', {
                    headers: { Authorization : `Bearer ${token}`}
                });
                if (!response.ok) {
                    throw new Error ('Failed to fetch inventory data');
                }
                const data = await response.json();
                setInventoryData(data);
            } catch (error) {
                console.error('Error fetching inventory data', error);
            }
        };

        fetchInventoryData();
    }, []);

    const columns = [
        { header: 'Id', accessor: 'id'},
        { header: 'Item Name', accessor: 'name'},
        { header: 'Category', accessor: 'category'},
        { header: 'Quantity', accessor: 'quantity'},
        { header: 'Price', accessor: 'price'},
    ];
    
    return (
        <div className='table-container'>
            <h2>Inventory</h2>
            <Table columns={columns} data={inventoryData}/>
        </div>
    )
};

export default Inventory;


