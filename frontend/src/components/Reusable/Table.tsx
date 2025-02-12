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
                                {column.accessor === 'items' && Array.isArray(row[column.accessor])?                                       
                                    row[column.accessor].length:
                                column.accessor === 'services' && Array.isArray(row[column.accessor])?
                                    row[column.accessor].map((service) => service.service.name).join(', '):                 
                                column.accessor === 'createdAt'?                                       
                                    (new Date(row[column.accessor]).toLocaleDateString('en-US',
                                        {year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'}
                                    )):
                                column.accessor === 'price' || column.accessor === 'totalCost' || column.accessor === 'totalAmount' || column.accessor === 'total' || column.accessor === 'amount' ?
                                    (`$${row[column.accessor]}`):
                                    (row[column.accessor])
                                }
                                                                      
                            </td>
                        ))}
                        
                            <td> 
                            <div className='button-container'>
                                <button onClick={() => onDelete(row.id)}>Delete</button>
                                {onEdit && <button onClick={() => {onEdit(row)}}>Edit</button>}
                            </div>
                            </td>

                       
                        
                    </tr>
                    )                   
                })}      
            </tbody>
        </table>
    )
}

export default Table;