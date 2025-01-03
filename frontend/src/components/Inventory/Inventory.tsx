import React, { useState, useEffect } from 'react';
import Table from '../Reusable/Table.tsx';
import AddInventory from './AddInventory.tsx';
import EditInventory from './EditInventory.tsx';
import SidePanel from '../Reusable/Sidepanel.tsx';

const Inventory = () => {
    const [inventoryData, setInventoryData] = useState<any[]>([]);
    const [isAddPanelOpen, setisAddPanelOpen] = useState(false);
    const [isEditPanelOpen, setisEditPanelOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // when mounting show all inventory records
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
    }, [inventoryData]);

    // functionality for adding a new inventory item to be used in the Add Inventory element
    const handleAdd = async (newItem) => {
        const newItem_ = {
            ... newItem,
            quantity: Number(newItem.quantity),
            price: Number(newItem.price)
        }
        const token = localStorage.getItem('token');
        const response = await fetch ('http://localhost:3000/api/inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                       'Authorization': `Bearer ${token}`},
            body: JSON.stringify(newItem_)
        });

        if (response.ok) {
            const addedItem = await response.json();
            setInventoryData([...inventoryData, addedItem]);
        }else {
            throw new Error("Error adding item")
        }
    }

    // functionality for deleting an item
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch (`http://localhost:3000/api/inventory/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
        })

        if (response.ok) {
            setInventoryData(prevData => prevData.filter (item => item.id !== id))
        }else{
            console.error ("Failed to delete item")
        }
    }

     // functionality for upating an item
     const handleUpdate = async (updatedItem) => {
        const token = localStorage.getItem('token');
        const response = await fetch (`http://localhost:3000/api/inventory/${updatedItem.id}`, {
            method: 'PUT',
            headers: {'Authorization': `Bearer ${token}`},
            body: JSON.stringify(updatedItem)
        })

        if (response.ok) {
            const updatedData = response.json();
            setInventoryData(prevData => prevData.map (item => (item.id === updatedItem.id)? updatedData: item));
        }else{
            console.error ("Failed to update item")
        }
    }

    //define columns
    const columns = [
        { header: 'Item Name', accessor: 'name'},
        { header: 'Category', accessor: 'category'},
        { header: 'Quantity', accessor: 'quantity'},
        { header: 'Price', accessor: 'price'},
    ];
    
    return (
        <div className='table-container'>
            <h2>Inventory</h2>
            <button onClick={() => setisAddPanelOpen(true)}>Add Item</button>
            <Table columns={columns} data={inventoryData} onDelete={handleDelete} onEdit={(item)=>{{setCurrentItem(item)};setisEditPanelOpen(true)}}/>
            <SidePanel isOpen={isAddPanelOpen} onClose={() => setisAddPanelOpen(false)}>
                <AddInventory onAdd = {handleAdd}/>
            </SidePanel>
            {currentItem && <SidePanel isOpen={isEditPanelOpen} onClose={() => setisEditPanelOpen(false)}>
                <EditInventory item={currentItem} onUpdate = {handleUpdate} onClose={() => setisEditPanelOpen(false)}/>
            </SidePanel>}

        </div>
    )
};

export default Inventory;


