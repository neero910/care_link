function Profile() {
    const { user, updateUserProfile } = useAuth();
    const [formData, setFormData] = React.useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = React.useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = React.useState({ text: '', type: '' });

    React.useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email || '' });
        }
    }, [user]);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        updateUserProfile({ name: formData.name, email: formData.email });
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            setMessage({ text: 'New passwords do not match.', type: 'error' });
            return;
        }
        // Mock success
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        setPasswordData({ current: '', new: '', confirm: '' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
            
            {message.text && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Personal Information">
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-lg">{user?.name}</p>
                                <p className="text-slate-500 capitalize">{user?.role}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <input type="text" disabled className="input-field bg-slate-50 text-slate-500" value={user?.role} />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </Card>

                <Card title="Security">
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                            <input type="password" required className="input-field" value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input type="password" required className="input-field" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                            <input type="password" required className="input-field" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="btn btn-secondary">Update Password</button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}