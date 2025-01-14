import React, { useState } from 'react';
import Select from 'react-select'

const AddPurchase = ({inventory, onAdd, onClose}) => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [totalCost, setTotalCost] = useState('');
    const [items, setItems] = useState<{inventoryId: Number| undefined, name: string, quantity: string, price: string, addToInventory: boolean}[]>([]);
    const [manualItem, setManualItem] = useState({inventoryId: undefined, name: '', quantity: '', price: '', addToInventory: false});

    const InventoryOptions = inventory.map((item) => ({
        value: item.name, // actual value of the item
        label: item.name, // what we see in the dropdown
        id: item.id,
    }))

    const handleItemSelect = (selectedOption) => {
        const selectedItem = inventory.find((item) => selectedOption.value === item.name);
        setItems((prevItems) => [
            ...prevItems,
            {inventoryId: selectedItem.id, name: selectedItem.name, quantity: '1', price: selectedItem.price, addToInventory: false}
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
        setManualItem({inventoryId: undefined,name: '', quantity: '', price: '', addToInventory: false})
    }

    const formattedItems = items.map((item) => ({
        inventoryId: item.inventoryId,
        quantity: Number(item.quantity),
        price: Number(item.price)
    }));
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newPurchase = {description, category, totalCost, formattedItems};
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
                placeholder='Total Cost'
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                required/>

               <h3>Select Purchase Items to Update Inventory (optional)</h3>
               <Select 
                    options={InventoryOptions}
                    onChange={handleItemSelect}
                    placeholder="Select items"
                    
                />
                
                <h4>Manually Add Item (if not already in inventory)</h4>
                <input 
                type ='text' 
                placeholder='Item Name'
                value={manualItem.name}
                onChange={(e) => handleManualItemChange('name',e.target.value)}
                />

                <input 
                type ='number' 
                placeholder='Quantity'
                value={manualItem.quantity}
                onChange={(e) => handleManualItemChange('quantity',e.target.value)}
                />

                <input 
                type ='number' 
                placeholder='Price'
                value={manualItem.price}
                onChange={(e) => handleManualItemChange('price',e.target.value)}
                />

                <label>
                    <input
                    type = 'checkbox'
                    checked= {manualItem.addToInventory}
                    onChange={(e) => handleManualItemChange('addToInventory',e.target.checked)}
                    />
                    Add this item to inventory
                </label>

                <button type='button' onClick={addManualItem}>Add Item to Purchase</button>

                <h4>Review Selected Items</h4>
                <ul>
                    {items.map((item, index) => (
                        <li>
                            {item.name} - Quantity: {item.quantity}, Price: {item.price}
                            {item.addToInventory && '(Will be added to inventory)'}
                            <input
                                type ='number' 
                                placeholder='Quantity'
                                value={item.quantity}
                                onChange={(e) => setItems((prevItems)=> 
                                    prevItems.map((prevItem, i) => 
                                        i === index? {...prevItem, quantity: e.target.value}: prevItem))}
                                required
                            />
                            <button type='button' onClick={() => setItems((prevItems) => prevItems.filter((_,i) => i !== index))}>
                                X
                            </button>
                        </li>
                    ))}
                </ul>

                <button type='submit'>Add Purchase</button>
            </form>
        </div>
       
    )
}

export default AddPurchase;
