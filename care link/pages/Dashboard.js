function Dashboard() {
    const [stats, setStats] = React.useState({ patients: 0, appointments: 0, revenue: 0, pending: 0 });
    const [recentAppointments, setRecentAppointments] = React.useState([]);

    React.useEffect(() => {
        // Load data
        const patients = DataService.get('patients');
        const appointments = DataService.get('appointments');
        const billing = DataService.get('billing');

        // Calculate stats
        const revenue = billing.reduce((sum, item) => item.status === 'Paid' ? sum + item.amount : sum, 0);
        const pending = billing.reduce((sum, item) => item.status === 'Pending' ? sum + item.amount : sum, 0);

        setStats({
            patients: patients.length,
            appointments: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length, // Today's appointments
            revenue: revenue,
            pending: pending
        });

        // Get recent 5 appointments
        setRecentAppointments(appointments.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Patients" 
                    value={stats.patients} 
                    icon="icon-users text-2xl" 
                    color="blue" 
                />
                <StatCard 
                    title="Today's Appointments" 
                    value={stats.appointments} 
                    icon="icon-calendar text-2xl" 
                    color="green" 
                />
                <StatCard 
                    title="Total Revenue" 
                    value={`$${stats.revenue.toLocaleString()}`} 
                    icon="icon-dollar-sign text-2xl" 
                    color="purple" 
                    trend="+12% from last month"
                />
                <StatCard 
                    title="Pending Bills" 
                    value={`$${stats.pending.toLocaleString()}`} 
                    icon="icon-clock text-2xl" 
                    color="orange" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Recent Appointments" action={<button className="text-sm text-blue-600 font-medium">View All</button>}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Doctor</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date/Time</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {recentAppointments.map(apt => (
                                        <tr key={apt.id}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{apt.patientName}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{apt.doctorName}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{apt.date} at {apt.time}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Badge status={apt.status} />
                                            </td>
                                        </tr>
                                    ))}
                                    {recentAppointments.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-6 text-center text-slate-500">No appointments found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
                <div>
                     <Card title="Quick Actions">
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-3">
                                <div className="icon-user-plus text-lg"></div>
                                <span className="font-medium">Register New Patient</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition flex items-center gap-3">
                                <div className="icon-calendar-plus text-lg"></div>
                                <span className="font-medium">Book Appointment</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex items-center gap-3">
                                <div className="icon-file-text text-lg"></div>
                                <span className="font-medium">Create Invoice</span>
                            </button>
                        </div>
                     </Card>
                </div>
            </div>
        </div>
    );
}