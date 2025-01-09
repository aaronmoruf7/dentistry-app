import React, { useState } from 'react';
import Select from 'react-select'

const AddPurchase = ({inventory, onAdd, onClose}) => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [totalCost, setTotalCost] = useState('');
    const [items, setItems] = useState<{name: string, quantity: string, price: string}[]>([]);
    const [manualItem, setManualItem] = useState({name: '', quantity: '', price: '', addToInventory: false});

    const InventoryOptions = inventory.map((item) => ({
        value: item.name, // actual value of the item
        label: item.name, // what we see in the dropdown
        id: item.id,
    }))

    const handleItemSelect = (selectedOption) => {
        const selectedItem = inventory.find((item) => selectedOption.value === item.name);
        setItems((prevItems) => [
            ...prevItems,
            {name: selectedItem.name, quantity: '1', price: selectedItem.price}
        ])
    }

    const handleManualItemChange = (field, value) => {
        setManualItem ((prev) => (
            {...prev,
            [field]: value
        }))
    };

    const addManualItem = () => {
        setItems((prevItems) => [...prevItems, {...manualItem}]);
        setManualItem({name: '', quantity: '', price: '', addToInventory: false})
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newPurchase = {description, category, totalCost, items};
        await onAdd (newPurchase);
        onClose()

        setDescription('');
        setCategory('');
        setTotalCost('');
        setItems([]);
    };

    return(
        <div className='add-item-container'>
            <form onSubmit={handleSubmit}>
                <h3>Purchase</h3>
                <input 
                type ='text' 
                placeholder='Description'
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

               <h3>Select Items</h3>
               <Select 
                    options={InventoryOptions}
                    onChange={handleItemSelect}
                    placeholder="Select items"/>

                <h3>Manually Add Item (if not inventory)</h3>

                <input 
                type ='text' 
                placeholder='Item Name'
                value={manualItem.name}
                onChange={(e) => handleManualItemChange('name',e.target.value)}
                required/>

                <input 
                type ='number' 
                placeholder='Item Name'
                value={manualItem.quantity}
                onChange={(e) => handleManualItemChange('quantity',e.target.value)}
                required/>

                <input 
                type ='number' 
                placeholder='Price'
                value={manualItem.price}
                onChange={(e) => handleManualItemChange('price',e.target.value)}
                required/>

                <label>
                    <input
                    type = 'checkbox'
                    checked= {manualItem.addToInventory}
                    onChange={(e) => handleManualItemChange('addToInventory',e.target.checked)}
                    />
                </label>

                <button type='button' onClick={addManualItem}>Add Item to Purchase</button>

                <button type='submit'>Add Item</button>
            </form>
        </div>
       
    )
}

export default AddPurchase;
