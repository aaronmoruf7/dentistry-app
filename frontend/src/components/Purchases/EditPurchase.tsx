import React, { useEffect, useState } from 'react';

const EditPurchase = ({purchase, onUpdate, onClose}) => {
    const [description, setDescription] = useState(purchase.description);
    const [category, setCategory] = useState(purchase.category);
    const [totalCost, setTotalCost] = useState(purchase.totalCost);
    const [items, setItems] = useState(purchase.items);

    useEffect(() => {
        console.log('Items passed to EditPurchase:', items);
        setDescription(purchase.description);
        setCategory(purchase.category);
        setTotalCost(purchase.totalCost);
        setItems(purchase.items);
    },[purchase]);

    const handleItemChange = (index, field, value) => {
        setItems((prevItems) => 
            prevItems.map((prevItem, i) => 
                i === index? {...prevItem, [field]: value}: prevItem))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedItems = items.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
            price: Number(item.price)
        }))
            
        
        const updatedItem = {
            id: purchase.id,
            description,
            category,
            totalCost: Number(totalCost),
            items: formattedItems
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
                placeholder='Total Cost'
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                required/>

                <h3>Edit Items</h3>
                {items.map((item, index) => (
                    <div key= {index} className='item-field'>
                        <div className='row'>
                            <label>
                                <h4>Item Name</h4>
                                <input 
                                type ='text' 
                                placeholder='Name'
                                value={item.name}
                                onChange={(e) => handleItemChange(index,'name',e.target.value)}
                                required/>
                            </label>
                            
                            <label>
                                <h4>Quantity</h4>
                                <input 
                                type ='number' 
                                placeholder='Quantity'
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index,'quantity', e.target.value)}
                                required/>
                            </label>
                            
                            <label>
                                <h4>Price</h4>
                                <input 
                                type ='number' 
                                placeholder='Price'
                                value={item.price}
                                onChange={(e) => handleItemChange(index,'price', e.target.value)}
                                required/>
                            </label>
                        </div>          
                    </div>
                ))}

                <button type='submit'>Update Item</button>
            </form>
        </div>
       
    )
}

export default EditPurchase;