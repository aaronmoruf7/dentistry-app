import React, { useEffect, useState } from 'react';

const EditService = ({service, onUpdate, onClose}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(''); 

    useEffect(() => {
        setName(service.name);
        setDescription(service.description);
        setPrice(service.price);
    },[service]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedService = {
            id: service.id,
            name,
            description,
            price: Number(price),
            items: service.id || []
        }

        await onUpdate (updatedService);
        onClose()
    };

    return(
        <div className='add-item-container'>
            <form onSubmit={handleSubmit}>
                <input 
                type ='text' 
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required/>

                <input 
                type ='text' 
                placeholder='Category'
                value={description}
                onChange={(e) => setDescription(e.target.value)}/>

                <input 
                type ='number' 
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required/>

                <button type='submit'>Update Service</button>
            </form>
        </div>
       
    )
}

export default EditService;