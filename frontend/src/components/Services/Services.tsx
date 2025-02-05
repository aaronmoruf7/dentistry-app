import React, { useState, useEffect } from 'react';
import Table from '../Reusable/Table.tsx';
import SidePanel from '../Reusable/Sidepanel.tsx';
import AddService from './AddService.tsx';
import EditService from './EditService.tsx';

const URL = 'https://begonia-medical.onrender.com';

const Services = () => {
    const [serviceData, setServiceData] = useState<any[]>([]);
    const [isAddPanelOpen, setisAddPanelOpen] = useState(false);
    const [isEditPanelOpen, setisEditPanelOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    //when mounting fetch all service data
    useEffect(() => {
        const fetchServiceData = async () => {
            try{
                const token = localStorage.getItem('token');
                const response = await fetch(`${URL}/api/services`, {
                    headers: { Authorization : `Bearer ${token}`} 
                });
                if (!response.ok) {
                    throw new Error ('Failed to fetch services data');
                }
                const data = await response.json();
                setServiceData(data);
            }catch(error){
                console.error('Error fetching services data', error);
            }
        }
        fetchServiceData();
    }, [])

    //create a new service
    const handleAdd = async (newService) => {
        const newService_ = {
            ... newService,
            price: Number(newService.price),
            items: newService.items || []
        }
        const token = localStorage.getItem('token');
        const response = await fetch (`${URL}/api/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                       'Authorization': `Bearer ${token}`},
            body: JSON.stringify(newService_)
        });

        if (response.ok) {
            const addedService = await response.json();
            setServiceData([...serviceData, addedService]);
        }else {
            throw new Error("Error adding service")
        }
    }

    //edit a service
    const handleUpdate = async (updatedService) => {
        const {id, ...updatedService_} = updatedService;
        const token = localStorage.getItem('token');
        console.log('Token',token);
        const response = await fetch (`${URL}/api/services/${updatedService.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
            body: JSON.stringify(updatedService_),
        });
        
        if (response.ok) {
            const updatedData = await response.json();
            setServiceData(prevData => 
                prevData.map (item => (item.id === updatedService.id? updatedData: item))
            );
        } else {
            throw new Error ("Error in response");
        }
    }

    //delete a service
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch (`${URL}/api/services/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
        });

        if (response.ok) {
            setServiceData(prevData => prevData.filter (item => item.id !== id))
        }else{
            console.error ("Failed to delete service")
        }
    }


    //define columns
    const columns = [
        { header: 'Service Name', accessor: 'name'},
        { header: 'Description', accessor: 'description'},
        { header: 'Price', accessor: 'price'},
        { header: 'Date', accessor: 'createdAt'},
    ];

    return(
        <div className='table-container'>
            <h2>Services</h2>
            <div className='add-button-container'>
                <button onClick={() => setisAddPanelOpen(true)}>Add Service</button>
            </div>            
            <Table columns={columns} data={serviceData} onDelete={handleDelete} onEdit={(item)=>{{setCurrentService(item)};setisEditPanelOpen(true)}}/>
            <SidePanel isOpen={isAddPanelOpen} onClose={() => setisAddPanelOpen(false)}>
                <AddService onAdd = {handleAdd} onClose={() => setisAddPanelOpen(false)}/>
            </SidePanel>
            {currentService && <SidePanel isOpen={isEditPanelOpen} onClose={() => setisEditPanelOpen(false)}>
                <EditService service={currentService} onUpdate = {handleUpdate} onClose={() => setisEditPanelOpen(false)}/>
            </SidePanel>}

        </div>
    )

}

export default Services;

