import React, { createContext, useContext, useState } from 'react';
import { InventoryItem } from '../../types';

//these types must be defined properly to prevent problems where the state is used

interface InventoryContextType {
    inventoryData: InventoryItem[],
    setInventoryData: React.Dispatch <React.SetStateAction<InventoryItem[]>> // to be able to have direct assignment and functional assignment
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const InventoryProvider : (React.FC<{ children: React.ReactNode }>) = ({children}) => {
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

    return(
        <InventoryContext.Provider value = {{inventoryData, setInventoryData}}>
            {children}
        </InventoryContext.Provider>
    )
    
}

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an Inventory Provider')
    }
    return context
}
export default InventoryProvider;


