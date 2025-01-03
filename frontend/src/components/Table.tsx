import React from 'react';

interface Column {
    header: string;
    accessor: string;
}

interface TableProps {
    columns: Column[];
    data: any[];
}

const Table = ({columns, data}: TableProps) => {
    return(
        <table className='table'>
            <thead>
                <tr>
                    {columns.map((column,index) => (
                        <th key={index}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row,rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column,colIndex) => (
                            <td key={colIndex}> {row[column.accessor]}</td>
                        ))}
                    </tr>
                ))}      
            </tbody>
        </table>
    )
}

export default Table;