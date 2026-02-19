function Login() {
    const { login, user } = useAuth();
    const history = window.ReactRouterDOM.useHistory();
    const [formData, setFormData] = React.useState({ username: '', password: '' });
    const [error, setError] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (user) {
            history.push('/dashboard');
        }
    }, [user, history]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await login(formData.username, formData.password);
            if (result.success) {
                history.push('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-200">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                         <div className="icon-activity text-2xl"></div>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to CareLink System</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2">
                        <div className="icon-circle-alert text-lg"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <div className="icon-user text-lg"></div>
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <div className="icon-lock text-lg"></div>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full btn btn-primary py-2.5 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Signing In...
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    <p>Demo Credentials:</p>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-left bg-slate-50 p-3 rounded border border-slate-100">
                         <div>admin / admin123</div>
                         <div>doctor / doctor123</div>
                         <div>reception / recep123</div>
                         <div>nurse / nurse123</div>
                    </div>
                </div>
            </div>
        </div>
    );
}