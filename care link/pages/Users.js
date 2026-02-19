function Users() {
    const [users, setUsers] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [newUser, setNewUser] = React.useState({
        name: '', username: '', role: 'doctor', status: 'Active', email: ''
    });

    React.useEffect(() => {
        setUsers(DataService.get('users'));
    }, []);

    const handleAddUser = (e) => {
        e.preventDefault();
        const user = {
            id: 'u' + Date.now(),
            ...newUser
        };
        const updated = [...users, user];
        setUsers(updated);
        DataService.set('users', updated);
        setIsModalOpen(false);
        setNewUser({ name: '', username: '', role: 'doctor', status: 'Active', email: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    <div className="icon-plus text-lg"></div>
                    Add User
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">Name</th>
                                <th className="table-header">Username</th>
                                <th className="table-header">Role</th>
                                <th className="table-header">Status</th>
                                <th className="table-header">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td className="table-cell font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            {u.name}
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-500">@{u.username}</td>
                                    <td className="table-cell"><span className="capitalize bg-slate-100 px-2 py-1 rounded text-xs font-semibold text-slate-600">{u.role}</span></td>
                                    <td className="table-cell"><Badge status={u.status} /></td>
                                    <td className="table-cell">
                                        <button className="text-slate-400 hover:text-blue-600">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New User">
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input required type="text" className="input-field" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input required type="text" className="input-field" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" className="input-field" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select className="input-field" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                <option value="admin">Admin</option>
                                <option value="doctor">Doctor</option>
                                <option value="reception">Reception</option>
                                <option value="nurse">Nurse</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select className="input-field" value={newUser.status} onChange={e => setNewUser({...newUser, status: e.target.value})}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                     <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save User</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}