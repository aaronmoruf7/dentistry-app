import React, { useState } from 'react';

const AddInventory = ({onAdd, onClose}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newItem = {name, category, quantity, price};
        await onAdd (newItem);
        onClose()

        setName('');
        setCategory('');
        setQuantity('');
        setPrice('');
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}/>

                <input 
                type ='number' 
                placeholder='Quantity'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required/>

                <input 
                type ='number' 
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required/>

                <button type='submit'>Add Item</button>
            </form>
        </div>
       
    )
}

export default AddInventory;
