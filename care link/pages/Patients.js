function Patients() {
    const [patients, setPatients] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [newPatient, setNewPatient] = React.useState({
        name: '', age: '', gender: 'Male', phone: '', address: '', notes: ''
    });

    React.useEffect(() => {
        setPatients(DataService.get('patients'));
    }, []);

    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPatient = (e) => {
        e.preventDefault();
        const patient = {
            ...newPatient,
            id: 'p' + (Date.now()), // Simple ID generation
        };
        const updatedList = [...patients, patient];
        setPatients(updatedList);
        DataService.set('patients', updatedList);
        setIsModalOpen(false);
        setNewPatient({ name: '', age: '', gender: 'Male', phone: '', address: '', notes: '' });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this patient?')) {
            const updatedList = patients.filter(p => p.id !== id);
            setPatients(updatedList);
            DataService.set('patients', updatedList);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Patient Management</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    <div className="icon-plus text-lg"></div>
                    Add Patient
                </button>
            </div>

            <Card>
                <div className="mb-6 max-w-md">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <div className="icon-search text-lg"></div>
                        </div>
                        <input
                            type="text"
                            placeholder="Search patients by name or ID..."
                            className="input-field pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">ID</th>
                                <th className="table-header">Name</th>
                                <th className="table-header">Age/Gender</th>
                                <th className="table-header">Contact</th>
                                <th className="table-header">Address</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50">
                                    <td className="table-cell font-mono text-xs text-slate-500">{patient.id}</td>
                                    <td className="table-cell font-medium text-slate-900">{patient.name}</td>
                                    <td className="table-cell">
                                        <div className="flex flex-col">
                                            <span>{patient.age} yrs</span>
                                            <span className="text-xs text-slate-500">{patient.gender}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell">{patient.phone}</td>
                                    <td className="table-cell truncate max-w-xs">{patient.address}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <button className="text-blue-600 hover:text-blue-800" title="Edit">
                                                <div className="icon-pencil text-lg"></div>
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-800" 
                                                title="Delete"
                                                onClick={() => handleDelete(patient.id)}
                                            >
                                                <div className="icon-trash-2 text-lg"></div>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPatients.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                        No patients found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Patient">
                <form onSubmit={handleAddPatient} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input required type="text" className="input-field" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                            <input required type="number" className="input-field" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select className="input-field" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input required type="tel" className="input-field" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <textarea className="input-field" rows="2" value={newPatient.address} onChange={e => setNewPatient({...newPatient, address: e.target.value})}></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Medical Notes</label>
                        <textarea className="input-field" rows="3" value={newPatient.notes} onChange={e => setNewPatient({...newPatient, notes: e.target.value})}></textarea>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Patient</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}