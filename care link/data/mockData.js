const INITIAL_DATA = {
    users: [
        { id: 'u1', name: 'Administrator', username: 'admin', role: 'admin', status: 'Active', email: 'admin@carelink.com' },
        { id: 'u2', name: 'Sarah Reception', username: 'reception', role: 'reception', status: 'Active', email: 'reception@carelink.com' },
        { id: 'u3', name: 'Dr. John Smith', username: 'doctor', role: 'doctor', status: 'Active', email: 'john@carelink.com' },
        { id: 'u4', name: 'Nurse Joy', username: 'nurse', role: 'nurse', status: 'Active', email: 'joy@carelink.com' },
        { id: 'u5', name: 'Manager Mike', username: 'manager', role: 'manager', status: 'Active', email: 'mike@carelink.com' }
    ],
    patients: [
        { id: 'p1', name: 'Alice Johnson', age: 34, gender: 'Female', phone: '555-0101', address: '123 Maple St', notes: 'Allergic to penicillin' },
        { id: 'p2', name: 'Bob Williams', age: 45, gender: 'Male', phone: '555-0102', address: '456 Oak Ave', notes: 'Hypertension history' },
        { id: 'p3', name: 'Charlie Brown', age: 28, gender: 'Male', phone: '555-0103', address: '789 Pine Ln', notes: 'Annual checkup' },
        { id: 'p4', name: 'Diana Prince', age: 30, gender: 'Female', phone: '555-0104', address: '321 Elm St', notes: 'Pregnancy week 12' },
        { id: 'p5', name: 'Evan Wright', age: 52, gender: 'Male', phone: '555-0105', address: '654 Birch Rd', notes: 'Post-surgery recovery' }
    ],
    appointments: [
        { id: 'a1', patientId: 'p1', patientName: 'Alice Johnson', doctorId: 'u3', doctorName: 'Dr. John Smith', date: '2026-02-18', time: '09:00', status: 'Completed' },
        { id: 'a2', patientId: 'p2', patientName: 'Bob Williams', doctorId: 'u3', doctorName: 'Dr. John Smith', date: '2026-02-18', time: '10:00', status: 'Scheduled' },
        { id: 'a3', patientId: 'p3', patientName: 'Charlie Brown', doctorId: 'u3', doctorName: 'Dr. John Smith', date: '2026-02-19', time: '09:00', status: 'Scheduled' },
        { id: 'a4', patientId: 'p4', patientName: 'Diana Prince', doctorId: 'u3', doctorName: 'Dr. John Smith', date: '2026-02-19', time: '11:00', status: 'Scheduled' }
    ],
    billing: [
        { id: 'b1', patientId: 'p1', patientName: 'Alice Johnson', amount: 150.00, status: 'Paid', date: '2026-02-18', notes: 'Consultation Fee' },
        { id: 'b2', patientId: 'p2', patientName: 'Bob Williams', amount: 200.00, status: 'Pending', date: '2026-02-18', notes: 'X-Ray and Consultation' }
    ]
};

const DataService = {
    init: () => {
        if (!localStorage.getItem('carelink_users')) {
            localStorage.setItem('carelink_users', JSON.stringify(INITIAL_DATA.users));
        }
        if (!localStorage.getItem('carelink_patients')) {
            localStorage.setItem('carelink_patients', JSON.stringify(INITIAL_DATA.patients));
        }
        if (!localStorage.getItem('carelink_appointments')) {
            localStorage.setItem('carelink_appointments', JSON.stringify(INITIAL_DATA.appointments));
        }
        if (!localStorage.getItem('carelink_billing')) {
            localStorage.setItem('carelink_billing', JSON.stringify(INITIAL_DATA.billing));
        }
    },
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(`carelink_${key}`)) || [];
        } catch (e) {
            return [];
        }
    },
    set: (key, data) => {
        localStorage.setItem(`carelink_${key}`, JSON.stringify(data));
    },
    // Helper to simulate delay
    simulateDelay: async (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))
};

// Initialize on load
DataService.init();