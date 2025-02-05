import React, { useState, useEffect } from 'react';
import Table from '../Reusable/Table.tsx';
import AddPurchase from './AddPurchase.tsx';
import EditPurchase from './EditPurchase.tsx';
import SidePanel from '../Reusable/Sidepanel.tsx';
import { useInventory } from '../SharedStates/InventoryProvider.tsx'

const URL = 'https://begonia-medical.onrender.com';

const Purchases = () => {
    const {inventoryData, setInventoryData} = useInventory()
    const [purchaseData, setPurchaseData] = useState<any[]>([]);
    const [isAddPanelOpen, setisAddPanelOpen] = useState(false);
    const [isEditPanelOpen, setisEditPanelOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // when mounting show all purchase records
    useEffect(() => {
        const fetchPurchaseData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token);
                const response = await fetch(`${URL}/api/purchases`, {
                    headers: { Authorization : `Bearer ${token}`}
                });
                if (!response.ok) {
                    throw new Error ('Failed to fetch purchase data');
                }
                const data = await response.json();
                setPurchaseData(data);
            } catch (error) {
                console.error('Error fetching purchase data', error);
            }
        };
        fetchPurchaseData();
    }, []);

    // functionality for creating a new purchase item
    const handleAdd = async (newPurchase) => {
        const newPurchase_ = {
            ... newPurchase,
            totalCost: Number(newPurchase.totalCost),
        }
        const token = localStorage.getItem('token');
        // console.log('New Purchase:', newPurchase_)
        
        const response = await fetch (`${URL}/api/purchases`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                       'Authorization': `Bearer ${token}`},
            body: JSON.stringify(newPurchase_)
        });

        if (response.ok) {
            const addedItem = await response.json();
            setPurchaseData([...purchaseData, addedItem]);
            // console.log('Purchase data:',purchaseData)
        }else {
            throw new Error("Error adding purchase")
        }
    }

    // functionality for deleting a purchase
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch (`${URL}/api/purchases/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
        });

        if (response.ok) {
            setPurchaseData(prevData => prevData.filter (item => item.id !== id))
        }else{
            console.error ("Failed to delete item")
        }
    }


    // functionality for updating a purchase
    const handleUpdate = async (updatedItem) => {
        const {id, ...updatedItem_} = updatedItem;
        const token = localStorage.getItem('token');
        console.log('Token',token);
        const response = await fetch (`${URL}/api/purchases/${updatedItem.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
            body: JSON.stringify(updatedItem_),
        });
        
        if (response.ok) {
            const updatedData = await response.json();
            // setPurchaseData(prevData => {
            //     const newData = prevData.map (item => (item.id === updatedItem.id)? updatedData: item);
            //     return newData;
            // })
        } else {
            throw new Error ("Error in response");
        }
    }

    //define columns
    const columns = [
        { header: 'Description', accessor: 'description'},
        { header: 'Category', accessor: 'category'},
        { header: 'Total Cost', accessor: 'totalCost'},
        { header: 'Items', accessor: 'items'},
        { header: 'Date', accessor: 'createdAt'},
        
    ];
    
    return (
        <div className='table-container'>
            <h2>Purchases</h2>
            <div className='add-button-container'>
                <button onClick={() => setisAddPanelOpen(true)}>Add Purchase</button>
            </div>
            <Table columns={columns} data={purchaseData} onDelete={handleDelete} onEdit={(item)=>{{setCurrentItem(item)};setisEditPanelOpen(true)}}/>
            <SidePanel isOpen={isAddPanelOpen} onClose={() => setisAddPanelOpen(false)}>
                <AddPurchase inventory={inventoryData} onAdd = {handleAdd} onClose={() => setisAddPanelOpen(false)}/>
            </SidePanel>
            {currentItem && <SidePanel isOpen={isEditPanelOpen} onClose={() => setisEditPanelOpen(false)}>
                <EditPurchase purchase={currentItem} onUpdate = {handleUpdate} onClose={() => setisEditPanelOpen(false)}/>
            </SidePanel>}

        </div>
    )
};

export default Purchases;


