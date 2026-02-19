const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('carelink_active_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        // Mock login delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = DataService.get('users');
        // Simple mock password check: assume all passwords are same pattern or just check username for simplicity as per prompt
        // Prompt says: admin / admin123 etc.
        
        const foundUser = users.find(u => u.username === username);
        
        if (foundUser) {
             // Mock password validation (In real app, hash check)
             // Using simple check based on prompt: username + '123' 
             // Exception: admin123, recep123, doctor123, nurse123, manager123
             
             let isValid = false;
             if (username === 'admin' && password === 'admin123') isValid = true;
             else if (username === 'reception' && password === 'recep123') isValid = true;
             else if (username === 'doctor' && password === 'doctor123') isValid = true;
             else if (username === 'nurse' && password === 'nurse123') isValid = true;
             else if (username === 'manager' && password === 'manager123') isValid = true;
             // Allow created users to login with generic password 'password123' for simplicity
             else if (password === 'password123') isValid = true;

             if (isValid) {
                 setUser(foundUser);
                 localStorage.setItem('carelink_active_user', JSON.stringify(foundUser));
                 return { success: true };
             }
        }
        
        return { success: false, message: 'Invalid username or password' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('carelink_active_user');
    };

    const updateUserProfile = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('carelink_active_user', JSON.stringify(newUser));
        
        // Also update in main users list
        const users = DataService.get('users');
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedData };
            DataService.set('users', users);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => React.useContext(AuthContext);