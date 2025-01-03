import React, { useEffect, useState } from 'react';

const EditInventory = ({item, onUpdate, onClose}) => {
    const [name, setName] = useState(item.name);
    const [category, setCategory] = useState(item.category);
    const [quantity, setQuantity] = useState(item.quantity);
    const [price, setPrice] = useState(item.price);

    useEffect(() => {
        setName(item.name);
        setCategory(item.category);
        setQuantity(item.quantity);
        setPrice(item.price);
    },[item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault;
        const updatedItem = {
            id: item.id,
            name,
            category,
            quantity: Number(quantity),
            price: Number(price)
        }

        await onUpdate (updatedItem);
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

                <button type='submit'>Update Item</button>
            </form>
        </div>
       
    )
}

export default EditInventory;