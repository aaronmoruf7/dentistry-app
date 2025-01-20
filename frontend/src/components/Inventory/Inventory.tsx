import React, { useState, useEffect } from 'react';
import Table from '../Reusable/Table.tsx';
import AddInventory from './AddInventory.tsx';
import EditInventory from './EditInventory.tsx';
import SidePanel from '../Reusable/Sidepanel.tsx';
import { useInventory } from '../SharedStates/InventoryProvider.tsx'


const Inventory = () => {
    const {inventoryData, setInventoryData} = useInventory()
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
    }, []);

    // functionality for creating a new inventory item
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
        });

        if (response.ok) {
            setInventoryData(prevData => prevData.filter (item => item.id !== id))
        }else{
            console.error ("Failed to delete item")
        }
    }


    // functionality for updating an item
    const handleUpdate = async (updatedItem) => {
        const {id, ...updatedItem_} = updatedItem;
        const token = localStorage.getItem('token');
        console.log('Token',token);
        const response = await fetch (`http://localhost:3000/api/inventory/${updatedItem.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
            body: JSON.stringify(updatedItem_),
        });
        
        if (response.ok) {
            const updatedData = await response.json();
            setInventoryData(prevData => 
                prevData.map (item => (item.id === updatedItem.id? updatedData: item))
            );
        } else {
            throw new Error ("Error in response");
        }
    }

    //define columns
    const columns = [
        { header: 'Item Name', accessor: 'name'},
        { header: 'Category', accessor: 'category'},
        { header: 'Quantity', accessor: 'quantity'},
        { header: 'Price/Unit', accessor: 'price'},
        { header: 'Date', accessor: 'createdAt'},
    ];
    
    return (
        <div className='table-container'>
            <h2>Inventory</h2>
            <div className='add-button-container'>
                <button onClick={() => setisAddPanelOpen(true)}>Add Item</button>
            </div>            <Table columns={columns} data={inventoryData} onDelete={handleDelete} onEdit={(item)=>{{setCurrentItem(item)};setisEditPanelOpen(true)}}/>
            <SidePanel isOpen={isAddPanelOpen} onClose={() => setisAddPanelOpen(false)}>
                <AddInventory onAdd = {handleAdd} onClose={() => setisAddPanelOpen(false)}/>
            </SidePanel>
            {currentItem && <SidePanel isOpen={isEditPanelOpen} onClose={() => setisEditPanelOpen(false)}>
                <EditInventory item={currentItem} onUpdate = {handleUpdate} onClose={() => setisEditPanelOpen(false)}/>
            </SidePanel>}

        </div>
    )
};

export default Inventory;


