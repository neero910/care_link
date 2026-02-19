function Billing() {
    const [bills, setBills] = React.useState([]);
    const [patients, setPatients] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [newBill, setNewBill] = React.useState({
        patientId: '', amount: '', status: 'Pending', notes: ''
    });

    React.useEffect(() => {
        setBills(DataService.get('billing'));
        setPatients(DataService.get('patients'));
    }, []);

    const handleCreateBill = (e) => {
        e.preventDefault();
        const patient = patients.find(p => p.id === newBill.patientId);
        const bill = {
            id: 'b' + Date.now(),
            ...newBill,
            amount: parseFloat(newBill.amount),
            date: new Date().toISOString().split('T')[0],
            patientName: patient?.name || 'Unknown'
        };

        const updated = [...bills, bill];
        setBills(updated);
        DataService.set('billing', updated);
        setIsModalOpen(false);
        setNewBill({ patientId: '', amount: '', status: 'Pending', notes: '' });
    };

    const toggleStatus = (id) => {
        const updated = bills.map(b => 
            b.id === id ? { ...b, status: b.status === 'Pending' ? 'Paid' : 'Pending' } : b
        );
        setBills(updated);
        DataService.set('billing', updated);
    };

    const totalRevenue = bills.reduce((sum, b) => b.status === 'Paid' ? sum + b.amount : sum, 0);
    const pendingAmount = bills.reduce((sum, b) => b.status === 'Pending' ? sum + b.amount : sum, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Billing & Invoices</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                     <p className="text-sm text-slate-500 font-medium">Total Revenue Collected</p>
                     <p className="text-3xl font-bold text-slate-900 mt-2">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                     <p className="text-sm text-slate-500 font-medium">Pending Payments</p>
                     <p className="text-3xl font-bold text-orange-600 mt-2">${pendingAmount.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-end">
                     <button onClick={() => setIsModalOpen(true)} className="btn btn-primary h-full py-4 px-8 text-lg">
                        <div className="icon-plus-circle text-2xl"></div>
                        Create New Bill
                     </button>
                </div>
            </div>

            <Card title="Invoice History">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">Invoice ID</th>
                                <th className="table-header">Patient</th>
                                <th className="table-header">Date</th>
                                <th className="table-header">Amount</th>
                                <th className="table-header">Status</th>
                                <th className="table-header">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {bills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-slate-50">
                                    <td className="table-cell font-mono text-xs text-slate-500">{bill.id}</td>
                                    <td className="table-cell font-medium">{bill.patientName}</td>
                                    <td className="table-cell text-slate-500">{bill.date}</td>
                                    <td className="table-cell font-medium">${bill.amount.toFixed(2)}</td>
                                    <td className="table-cell">
                                        <Badge status={bill.status} />
                                    </td>
                                    <td className="table-cell">
                                        {bill.status === 'Pending' && (
                                            <button onClick={() => toggleStatus(bill.id)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                Mark as Paid
                                            </button>
                                        )}
                                        {bill.status === 'Paid' && (
                                            <span className="text-xs text-slate-400">Completed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Invoice">
                <form onSubmit={handleCreateBill} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
                        <select required className="input-field" value={newBill.patientId} onChange={e => setNewBill({...newBill, patientId: e.target.value})}>
                            <option value="">Select Patient</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                        <input required type="number" step="0.01" className="input-field" value={newBill.amount} onChange={e => setNewBill({...newBill, amount: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select className="input-field" value={newBill.status} onChange={e => setNewBill({...newBill, status: e.target.value})}>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <textarea className="input-field" rows="2" value={newBill.notes} onChange={e => setNewBill({...newBill, notes: e.target.value})}></textarea>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Invoice</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}