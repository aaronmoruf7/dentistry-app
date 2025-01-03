import React from 'react';

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
                    {columns.map((column,index) => (
                        <th key={index}>{column.header}</th>
                    ))}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row,rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column,colIndex) => (
                            <td key={colIndex}> {row[column.accessor]}</td>
                        ))}
                        <td> 
                            <button onClick={() => onDelete(row.id)}>Delete</button>
                            <button onClick={() => onEdit(row)}>Edit</button>
                        </td>
                    </tr>
                    
                ))}      
            </tbody>
        </table>
    )
}

export default Table;