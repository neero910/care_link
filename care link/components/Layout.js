const { Link, NavLink, useLocation, useHistory } = window.ReactRouterDOM;

function Sidebar({ user }) {
    const role = user?.role;
    
    // Define menu items based on role
    const getMenuItems = () => {
        const items = [
            { name: 'Dashboard', path: '/dashboard', icon: 'icon-layout-dashboard', roles: ['all'] },
            { name: 'Patients', path: '/patients', icon: 'icon-users', roles: ['admin', 'reception', 'doctor', 'nurse'] },
            { name: 'Appointments', path: '/appointments', icon: 'icon-calendar', roles: ['admin', 'reception', 'doctor'] },
            { name: 'Billing', path: '/billing', icon: 'icon-credit-card', roles: ['admin', 'reception'] },
            { name: 'Reports', path: '/reports', icon: 'icon-chart-bar', roles: ['admin', 'manager'] },
            { name: 'Users', path: '/users', icon: 'icon-shield', roles: ['admin'] },
            { name: 'Profile', path: '/profile', icon: 'icon-user', roles: ['all'] },
        ];
        
        return items.filter(item => item.roles.includes('all') || item.roles.includes(role));
    };

    const menuItems = getMenuItems();

    return (
        <div className="w-[var(--sidebar-width)] bg-white border-r border-slate-200 min-h-screen flex flex-col fixed left-0 top-0 z-30">
            <div className="h-16 flex items-center px-6 border-b border-slate-200">
                <div className="bg-blue-600 rounded p-1 mr-2">
                    <div className="icon-activity text-white text-xl"></div>
                </div>
                <span className="text-xl font-bold text-slate-800">CareLink</span>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink 
                                to={item.path} 
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                activeClassName="bg-blue-50 text-blue-600"
                            >
                                <div className={`${item.icon} text-lg`}></div>
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            
            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Topbar({ user, onLogout }) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 ml-[var(--sidebar-width)]">
            <h2 className="text-lg font-semibold text-slate-800">Hospital Management System</h2>
            
            <div className="flex items-center gap-4">
                <div className="relative group">
                     <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full">
                         <div className="icon-bell text-xl"></div>
                     </button>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
                >
                    <div className="icon-log-out text-lg"></div>
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </header>
    );
}

function MainLayout({ children }) {
    const { user, logout } = useAuth();
    const history = useHistory();

    const handleLogout = () => {
        logout();
        history.push('/login');
    };

    return (
        <div className="min-h-screen bg-[var(--bg-light)]">
            <Sidebar user={user} />
            <Topbar user={user} onLogout={handleLogout} />
            <main className="ml-[var(--sidebar-width)] p-8">
                {children}
            </main>
        </div>
    );
}