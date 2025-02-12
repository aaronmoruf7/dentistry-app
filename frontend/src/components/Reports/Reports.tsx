import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Table from '../Reusable/Table.tsx';

const URL = 'https://begonia-medical.onrender.com';

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

    const fetchReportData = async () => {
        try {
            const response = await fetch(`${URL}/api/reports?month=${month}`);
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

    //define columns
    const purchaseColumns = [
        { header: 'Date', accessor: 'createdAt'},
        { header: 'Supplier', accessor: 'description'},
        { header: 'Total Cost', accessor: 'totalCost'},    
    ];

    const invoiceColumns = [
        { header: 'Date', accessor: 'createdAt'},
        { header: 'Name', accessor: 'patientName'},
        { header: 'Total', accessor: 'totalAmount'},    
    ];

    return (
        <div className='table-container'>
            <h2>Monthly Reports</h2>

            <div className='filter-container'>
                <label htmlFor='monthFilter'>Select Month:</label>
                <select id='monthFilter' value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">All</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{new Date(2025, i, 1).toLocaleString('default', { month: 'long' })}</option>
                    ))}
                </select>
            </div>

            <button onClick={fetchReportData}>Generate Monthly Report</button>

            {reportData && (
                <div id='report'>
                    <header className='invoice-header'>
                        <h1>Tooth Teck & Spa Monthly Report</h1>
                    </header>

                    <section className='report-summary'>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                        <p><strong>Report Month:</strong> {month ? new Date(2025, Number(month), 1).toLocaleString('default', { month: 'long' }) : 'All'}</p>
                        <p><strong>Total Purchases:</strong> ${reportData.totalPurchases.toFixed(2)}</p>
                        <p><strong>Total Revenue:</strong> ${reportData.totalRevenue.toFixed(2)}</p>
                        <p><strong>Net Profit:</strong> ${reportData.netProfit.toFixed(2)}</p>
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
