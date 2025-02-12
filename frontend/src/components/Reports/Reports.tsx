import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Table from '../Reusable/Table.tsx';

const URL = 'https://begonia-medical.onrender.com';
// const URL = 'http://localhost:3000'

type ReportData = {
    totalPurchases: number;
    totalRevenue: number;
    netProfit: number;
    purchases: { date: string; item: string; amount: number }[];
    invoices: { date: string; patient: string; total: number }[];
};

const Reports = () => {
    
    const [month, setMonth] = useState('');
    const [reportData, setReportData] = useState<ReportData | null>(null);

    useEffect(() => {
        if (month !== "") {
            fetchReportData();
        }
    }, [month]);

    const fetchReportData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${URL}/api/reports?month=${month}`, {
                headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }})
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error("Error fetching report data:", error);
        }
        
    };

    const generateReportPDF = async () => {
        const reportElement = document.getElementById('report');
        if (reportElement) {
            const canvas = await html2canvas(reportElement);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', 0, 0, 210, canvas.height * (210 / canvas.width));
            pdf.save(`Monthly_Report_${month || 'All'}.pdf`);
        }
    };

    const formatMoney = (amount: number) => {
        return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    //define columns
    const purchaseColumns = [
        { header: 'Date', accessor: 'date' }, 
        { header: 'Supplier', accessor: 'description' }, 
        { header: 'Total Cost', accessor: 'amount' }
    ];
    
    const invoiceColumns = [
        { header: 'Date', accessor: 'date' },
        { header: 'Name', accessor: 'patient' }, 
        { header: 'Total', accessor: 'total' }
    ];
    

    return (
        <div className='table-container'>
            <h2>Monthly Reports</h2>

            <div className='filter-container'>
                <label htmlFor='monthFilter'>Select Month:</label>
                <select id='monthFilter' value={month || ""} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">All</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{new Date(2025, i, 1).toLocaleString('default', { month: 'long' })}</option>
                    ))}
                </select>
            </div>

            {reportData && (
                <div id='report'>
                    <header className='invoice-header'>
                        <h1>Tooth Teck & Spa Monthly Report</h1>
                    </header>

                    <section className='report-summary'>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                        <p><strong>Report Month:</strong> {month ? new Date(2025, Number(month), 1).toLocaleString('default', { month: 'long' }) : 'All'}, 2025</p>
                        <p><strong>Total Purchases:</strong> {formatMoney(reportData.totalPurchases)}</p>
                        <p><strong>Total Revenue:</strong> {formatMoney(reportData.totalRevenue)}</p>
                        <p><strong>Net Profit:</strong> {formatMoney(reportData.netProfit)}</p>

                    </section>

                    <h3>Purchases</h3>
                    <Table data={reportData.purchases} columns={purchaseColumns} onDelete={null} onEdit={null}/>

                    <h3>Invoices</h3>
                    <Table data={reportData.invoices} columns={invoiceColumns} onDelete={null} onEdit={null}/>

                    <button onClick={generateReportPDF}>Download PDF</button>
                </div>
            )}
        </div>
    );
};

export default Reports;
