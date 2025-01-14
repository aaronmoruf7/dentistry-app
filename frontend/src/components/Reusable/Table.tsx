import React, { useEffect } from 'react';

interface Column {
    header: string;
    accessor: string;
}

interface TableProps {
    columns: Column[];
    data: any[];
    onDelete;
    onEdit;
}


const Table = ({columns, data, onDelete, onEdit}: TableProps) => {
    console.log('Data passed to Table:', data);
    return(
        <table className='table'>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.accessor}>{column.header}</th>
                    ))}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => {                
                    return(
                    <tr key={row.id}>
                        {columns.map((column) => (
                            <td key={column.accessor}>
                                {column.accessor === 'items'?
                                    ( <span title= {row[column.accessor]
                                        .map((item) => `${item.name}, Qty: ${item.quanitity}`)
                                        .join('; ')}>
                                    </span>)                               
                                :(row[column.accessor])}                               
                            </td>
                        ))}
                        <td> 
                            <button onClick={() => onDelete(row.id)}>Delete</button>
                            <button onClick={() => {onEdit(row)}}>Edit</button>
                        </td>
                    </tr>
                    )                   
                })}      
            </tbody>
        </table>
    )
}

export default Table;