import React, { useEffect, useState } from 'react';

const EditPurchase = ({item, onUpdate, onClose}) => {
    const [description, setDescription] = useState(item.description);
    const [category, setCategory] = useState(item.category);
    const [totalCost, setTotalCost] = useState(item.totalCost);
    const [items, setItems] = useState(item.items);

    useEffect(() => {
        setDescription(item.description);
        setCategory(item.category);
        setTotalCost(item.totalCost);
        setItems(item.items);
    },[item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedItem = {
            id: item.id,
            description,
            category,
            totalCost: Number(totalCost),
            items
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required/>

                <input 
                type ='text' 
                placeholder='Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}/>

                <input 
                type ='number' 
                placeholder='Quantity'
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                required/>

                <input 
                type ='number' 
                placeholder='Price'
                value={items}
                onChange={(e) => setItems(e.target.value)}
                required/>

                <button type='submit'>Update Item</button>
            </form>
        </div>
       
    )
}

export default EditPurchase;