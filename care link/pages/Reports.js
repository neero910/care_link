function Reports() {
    const barChartRef = React.useRef(null);
    const lineChartRef = React.useRef(null);
    const pieChartRef = React.useRef(null);
    const chartInstances = React.useRef({});

    React.useEffect(() => {
        const appointments = DataService.get('appointments');
        const billing = DataService.get('billing');
        const patients = DataService.get('patients');

        // 1. Appointments per day (Bar Chart)
        // Group by date, simple logic for last 7 days including today or just existing data
        const dateCounts = {};
        appointments.forEach(a => {
            dateCounts[a.date] = (dateCounts[a.date] || 0) + 1;
        });
        const dates = Object.keys(dateCounts).sort();
        const aptCounts = dates.map(d => dateCounts[d]);

        // 2. Revenue over time (Line Chart)
        const revCounts = {};
        billing.forEach(b => {
            if (b.status === 'Paid') {
                revCounts[b.date] = (revCounts[b.date] || 0) + b.amount;
            }
        });
        const revDates = Object.keys(revCounts).sort();
        const revAmounts = revDates.map(d => revCounts[d]);

        // 3. Gender Distribution (Pie Chart)
        const genderCounts = { Male: 0, Female: 0, Other: 0 };
        patients.forEach(p => {
            if (genderCounts[p.gender] !== undefined) genderCounts[p.gender]++;
            else genderCounts.Other++;
        });

        const ctxBar = barChartRef.current.getContext('2d');
        const ctxLine = lineChartRef.current.getContext('2d');
        const ctxPie = pieChartRef.current.getContext('2d');

        // Cleanup
        if (chartInstances.current.bar) chartInstances.current.bar.destroy();
        if (chartInstances.current.line) chartInstances.current.line.destroy();
        if (chartInstances.current.pie) chartInstances.current.pie.destroy();

        // Create Charts
        chartInstances.current.bar = new window.ChartJS(ctxBar, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Appointments',
                    data: aptCounts,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        chartInstances.current.line = new window.ChartJS(ctxLine, {
            type: 'line',
            data: {
                labels: revDates,
                datasets: [{
                    label: 'Revenue ($)',
                    data: revAmounts,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        chartInstances.current.pie = new window.ChartJS(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['Male', 'Female', 'Other'],
                datasets: [{
                    data: [genderCounts.Male, genderCounts.Female, genderCounts.Other],
                    backgroundColor: ['#3b82f6', '#ec4899', '#64748b'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        return () => {
            if (chartInstances.current.bar) chartInstances.current.bar.destroy();
            if (chartInstances.current.line) chartInstances.current.line.destroy();
            if (chartInstances.current.pie) chartInstances.current.pie.destroy();
        };
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Analytics & Reports</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Appointments Overview">
                    <div className="h-64">
                        <canvas ref={barChartRef}></canvas>
                    </div>
                </Card>
                
                <Card title="Revenue Trends">
                    <div className="h-64">
                        <canvas ref={lineChartRef}></canvas>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Patient Demographics (Gender)">
                    <div className="h-64 flex justify-center">
                        <canvas ref={pieChartRef}></canvas>
                    </div>
                </Card>
                <div className="lg:col-span-2">
                    <Card title="Key Insights">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 text-green-700 rounded-md">
                                    <div className="icon-trending-up text-lg"></div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Revenue Growth</h4>
                                    <p className="text-sm text-slate-500">Revenue has increased by 12% compared to last week.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
                                    <div className="icon-users text-lg"></div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">New Patients</h4>
                                    <p className="text-sm text-slate-500">5 new patients registered today.</p>
                                </div>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}