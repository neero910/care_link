function Card({ children, className = '', title, action }) {
    return (
        <div className={`card ${className}`}>
            {(title || action) && (
                <div className="flex justify-between items-center mb-4">
                    {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}

function StatCard({ title, value, icon, color = 'blue', trend }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                    {trend && <p className="text-xs text-green-600 mt-1 flex items-center">
                        <span className="icon-trending-up mr-1 text-xs"></span> {trend}
                    </p>}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
                    <div className={icon}></div>
                </div>
            </div>
        </div>
    );
}

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-slate-900 opacity-75" onClick={onClose}></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg leading-6 font-medium text-slate-900">{title}</h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                                <div className="icon-x text-xl"></div>
                            </button>
                        </div>
                        <div className="mt-2">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ status }) {
    const styles = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-slate-100 text-slate-800',
        Paid: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Scheduled: 'bg-blue-100 text-blue-800',
        Completed: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
        Male: 'bg-blue-50 text-blue-700',
        Female: 'bg-pink-50 text-pink-700'
    };
    
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
            {status}
        </span>
    );
}