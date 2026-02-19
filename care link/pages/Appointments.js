function Appointments() {
    const [appointments, setAppointments] = React.useState([]);
    const [patients, setPatients] = React.useState([]);
    const [doctors, setDoctors] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [error, setError] = React.useState('');
    
    const [newApt, setNewApt] = React.useState({
        patientId: '', doctorId: '', date: '', time: '', status: 'Scheduled'
    });

    React.useEffect(() => {
        setAppointments(DataService.get('appointments'));
        setPatients(DataService.get('patients'));
        const allUsers = DataService.get('users');
        setDoctors(allUsers.filter(u => u.role === 'doctor'));
    }, []);

    const handleBook = (e) => {
        e.preventDefault();
        setError('');

        // Conflict check
        const conflict = appointments.find(a => 
            a.doctorId === newApt.doctorId && 
            a.date === newApt.date && 
            a.time === newApt.time
        );

        if (conflict) {
            setError('This time slot is already booked for the selected doctor.');
            return;
        }

        const patient = patients.find(p => p.id === newApt.patientId);
        const doctor = doctors.find(d => d.id === newApt.doctorId);

        const appointment = {
            id: 'a' + Date.now(),
            ...newApt,
            patientName: patient?.name || 'Unknown',
            doctorName: doctor?.name || 'Unknown'
        };

        const updated = [...appointments, appointment];
        setAppointments(updated);
        DataService.set('appointments', updated);
        setIsModalOpen(false);
        setNewApt({ patientId: '', doctorId: '', date: '', time: '', status: 'Scheduled' });
    };

    const updateStatus = (id, newStatus) => {
        const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
        setAppointments(updated);
        DataService.set('appointments', updated);
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    <div className="icon-calendar-plus text-lg"></div>
                    Book Appointment
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">ID</th>
                                <th className="table-header">Patient</th>
                                <th className="table-header">Doctor</th>
                                <th className="table-header">Date & Time</th>
                                <th className="table-header">Status</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {appointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-slate-50">
                                    <td className="table-cell font-mono text-xs text-slate-500">{apt.id}</td>
                                    <td className="table-cell font-medium">{apt.patientName}</td>
                                    <td className="table-cell text-slate-500">{apt.doctorName}</td>
                                    <td className="table-cell">
                                        <div className="flex flex-col">
                                            <span>{apt.date}</span>
                                            <span className="text-xs text-slate-500">{apt.time}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <Badge status={apt.status} />
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            {apt.status === 'Scheduled' && (
                                                <>
                                                    <button onClick={() => updateStatus(apt.id, 'Completed')} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Complete">
                                                        <div className="icon-check text-lg"></div>
                                                    </button>
                                                    <button onClick={() => updateStatus(apt.id, 'Cancelled')} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Cancel">
                                                        <div className="icon-x text-lg"></div>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book New Appointment">
                <form onSubmit={handleBook} className="space-y-4">
                    {error && <div className="p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">{error}</div>}
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
                        <select required className="input-field" value={newApt.patientId} onChange={e => setNewApt({...newApt, patientId: e.target.value})}>
                            <option value="">Select Patient</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
                        <select required className="input-field" value={newApt.doctorId} onChange={e => setNewApt({...newApt, doctorId: e.target.value})}>
                            <option value="">Select Doctor</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input required type="date" className="input-field" value={newApt.date} onChange={e => setNewApt({...newApt, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                            <input required type="time" className="input-field" value={newApt.time} onChange={e => setNewApt({...newApt, time: e.target.value})} />
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                         <select className="input-field" value={newApt.status} onChange={e => setNewApt({...newApt, status: e.target.value})}>
                             <option value="Scheduled">Scheduled</option>
                             <option value="Completed">Completed</option>
                             <option value="Cancelled">Cancelled</option>
                         </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Book</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}