import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const AddInvoice = ( {services, onGenerate, onClose} ) => {
    const [patientName, setPatientName] = useState('');
    const [selectedServices, setSelectedServices] = useState<{ id: number; name: string; description: string; quantity: string; price: number}[]>([]);
    const [paymentType, setPaymentType] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    const handleSelectService = (e) => {
        const serviceID = parseInt(e.target.value);
        const selectedService = services.find((service) => service.id == serviceID)

        if (selectedService) {
            setSelectedServices((prev) => [...prev, {...selectedService, quantity: 1}])
            setTotalAmount((prev) => prev + (selectedService.price || 0))
        }

    };

    const handleRemoveService = (index) => {
        const removedService = selectedServices[index];
        setSelectedServices((prev) => prev.filter((_,i) => i !== index))
        setTotalAmount((prev) => prev - (removedService.price || 0))

    };

    const handleChangeQuantity = (e, service, index) => {
        const newQuantity = e.target.value;
        const prevQuantity = service.quantity;
        const priceDifference = (newQuantity - prevQuantity) * service.price

        //update quantity of service
        setSelectedServices ((prev) => prev.map((prevService, i) => (
            i === index? {...prevService, quantity: newQuantity} : prevService
        )));

        //update totalAmount
        setTotalAmount((prev) => prev + priceDifference)

    }

    const invoiceData = {
        patientName,
        paymentType,
        totalAmount,
        services: selectedServices.map((service) => ({
            serviceId: service.id,
            quantity: Number(service.quantity)
        }))
    }

    const generateInvoice = async (invoiceData) => {
        const invoiceElement = document.getElementById('invoice');
        if (invoiceElement) {
            const canvas = await html2canvas(invoiceElement);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p','mm', 'a4');
            pdf.addImage(imgData, 'PNG', 0, 0, 210, canvas.height * (210/canvas.width));
            pdf.save(`Invoice_${patientName}.pdf`)
        }

        onGenerate(invoiceData)
        onClose()

    };

    const generateInvoiceNumber = () => {
        const now = new Date();
        return `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}`
    }

    return(
        <div className='create-invoice'>
            <h2>Create Invoice</h2>
            <button className='close-button' onClick={onClose}>X</button>
            <form>
                <input 
                    type ='text' 
                    placeholder='Patient Name'
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}/>
                <select onChange={handleSelectService} defaultValue=''>
                    <option value='' disabled>
                        Select a Service
                    </option>
                    {services.map((service)=>(
                        <option key={service.id} value={service.id}>
                            {service.name} : ${service.price}
                        </option>
                ))}
                </select>
                <select onChange={(e) => setPaymentType(e.target.value)} value={paymentType}>
                    <option value='' disabled>
                        Select Payment Type
                    </option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Linx">Linx</option>
                </select>
                <ul>
                    {selectedServices.map((service, index) => (
                        <li className='add-invoice-items-container' key = {index}>
                            {service.name}: ${service.price}
                            <input
                            type ='number'
                            min = '1'
                            value={service.quantity}
                            onChange={(e) => {handleChangeQuantity(e,service,index)}}/>
                            <button type='button' onClick={() => handleRemoveService(index)}>Remove</button>
                        </li>
                        
                    ))}
                </ul>
                <h3>Total Amount: ${totalAmount}</h3>
                <button type='button' onClick={() => generateInvoice(invoiceData)}>Generate Invoice PDF</button>
            </form>

            {/* Invoice Preview */}
            <div id='invoice'>
                <header className='invoice-header'>
                    <div>
                        <h1>Tooth Teck & Spa</h1>
                        <p>#8 Fifth Street, San Juan</p>
                        <p>Email: toothteck@gmail.com | Phone: (868)378-9043 / (868)491-5460 </p>
                    </div>
                </header>

                <section className='invoice-details'>
                    <p><strong>Invoice Number:</strong>{generateInvoiceNumber()}</p>
                    <p><strong>Invoice Date:</strong>{new Date().toLocaleDateString()}</p>
                    <p><strong>Name:</strong> {patientName}</p>
                </section>
              
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price (TTD)</th>
                        </tr> 
                    </thead>                        
                    <tbody>
                        {selectedServices.map((service, index) => (
                        <tr key = {index}>
                            <td>{service.name}</td>
                            <td>{service.description}</td>
                            <td>{parseInt(service.quantity)}</td>
                            <td>${service.price * parseInt(service.quantity)}</td>                            
                        </tr>
                        ))}  
                    </tbody>                      
                </table>
                <h3> Total: ${totalAmount}</h3>
                <div className="invoice-footer">
                    <p>THANK YOU FOR YOUR BUSINESS</p>
                    <br />
                    <p>I AGREE TO PAY THE ABOVE AMOUNT</p>
                    <p>RETAIN THIS COPY FOR YOUR RECORDS</p>
                    <br />
                    <p>YOU WERE SERVED BY <span className="served-by">____________________</span></p>
                </div>
                {/* <footer className='invoice-footer'>
                    <p>Thank you for choosing Begonia Medical</p>
                    <p>Please retain this invoice for your records</p>
                </footer> */}
            </div>         
        </div>
    )
};

export default AddInvoice;

