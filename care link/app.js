const { HashRouter, Route, Switch, Redirect } = window.ReactRouterDOM;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full border border-red-200">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <div className="icon-triangle-alert text-3xl"></div>
                            <h2 className="text-2xl font-bold">Something went wrong</h2>
                        </div>
                        <p className="text-slate-600 mb-4">An unexpected error has occurred in the application.</p>
                        <details className="bg-slate-100 p-4 rounded text-xs font-mono text-slate-700 overflow-auto max-h-48 mb-6">
                            <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Wrapper for Protected Routes with Role Checking
function ProtectedRoute({ component: Component, allowedRoles, ...rest }) {
    const { user } = useAuth();
    
    return (
        <Route
            {...rest}
            render={(props) => {
                if (!user) {
                    return <Redirect to="/login" />;
                }
                
                if (allowedRoles && !allowedRoles.includes(user.role)) {
                    return (
                        <MainLayout>
                            <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                                    <div className="icon-shield-alert text-3xl"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
                                <p className="text-slate-500 mt-2 max-w-md">You do not have permission to view this page. Please contact your administrator if you believe this is an error.</p>
                            </div>
                        </MainLayout>
                    );
                }

                return (
                    <MainLayout>
                        <Component {...props} />
                    </MainLayout>
                );
            }}
        />
    );
}

function App() {
    return (
        <HashRouter>
            <AuthProvider>
                <Switch>
                    <Route path="/login" component={Login} />
                    
                    <ProtectedRoute 
                        path="/dashboard" 
                        component={Dashboard} 
                        allowedRoles={['admin', 'reception', 'doctor', 'nurse', 'manager']} 
                    />
                    
                    <ProtectedRoute 
                        path="/patients" 
                        component={Patients} 
                        allowedRoles={['admin', 'reception', 'doctor', 'nurse']} 
                    />
                    
                    <ProtectedRoute 
                        path="/appointments" 
                        component={Appointments} 
                        allowedRoles={['admin', 'reception', 'doctor']} 
                    />
                    
                    <ProtectedRoute 
                        path="/billing" 
                        component={Billing} 
                        allowedRoles={['admin', 'reception']} 
                    />
                    
                    <ProtectedRoute 
                        path="/reports" 
                        component={Reports} 
                        allowedRoles={['admin', 'manager']} 
                    />
                    
                    <ProtectedRoute 
                        path="/users" 
                        component={Users} 
                        allowedRoles={['admin']} 
                    />
                    
                    <ProtectedRoute 
                        path="/profile" 
                        component={Profile} 
                        allowedRoles={['admin', 'reception', 'doctor', 'nurse', 'manager']} 
                    />
                    
                    <Route exact path="/">
                        <Redirect to="/dashboard" />
                    </Route>
                    
                    <Route path="*">
                         <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                            <h1 className="text-4xl font-bold text-slate-800">404</h1>
                            <p className="text-slate-500 mt-2">Page not found</p>
                            <a href="#/dashboard" className="mt-4 btn btn-primary">Go Home</a>
                         </div>
                    </Route>
                </Switch>
            </AuthProvider>
        </HashRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);