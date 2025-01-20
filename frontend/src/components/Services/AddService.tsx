import React, { useState } from 'react';

const AddService  = ({onAdd, onClose}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(''); 

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            const newService = {name, description, price};
            await onAdd (newService);
            onClose()
    
            setName('');
            setDescription('');
            setPrice('');
        };

    return(
        <div className='add-item-container'>
            <form onSubmit={handleSubmit}>
                <input 
                type ='text' 
                placeholder='Service Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required/>

                <input 
                type ='text' 
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}/>

                <input 
                type ='number' 
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required/>

                <button type='submit'>Add Service</button>
            </form>
        </div>
        
    )
}

export default AddService;