const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Billing = require('./models/Billing');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carelink', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Billing.deleteMany({});

    console.log('Cleared existing data');

    // Create users with hashed passwords
    const users = await User.create([
      {
        name: 'Administrator',
        username: 'admin',
        email: 'admin@carelink.com',
        password: 'admin123',
        role: 'admin',
        status: 'Active',
      },
      {
        name: 'Sarah Reception',
        username: 'reception',
        email: 'reception@carelink.com',
        password: 'recep123',
        role: 'reception',
        status: 'Active',
      },
      {
        name: 'Dr. John Smith',
        username: 'doctor',
        email: 'john@carelink.com',
        password: 'doctor123',
        role: 'doctor',
        status: 'Active',
      },
      {
        name: 'Nurse Joy',
        username: 'nurse',
        email: 'joy@carelink.com',
        password: 'nurse123',
        role: 'nurse',
        status: 'Active',
      },
      {
        name: 'Manager Mike',
        username: 'manager',
        email: 'mike@carelink.com',
        password: 'manager123',
        role: 'manager',
        status: 'Active',
      },
    ]);

    console.log('Created users:', users.length);

    // Create patients
    const patients = await Patient.create([
      {
        name: 'Alice Johnson',
        age: 34,
        gender: 'Female',
        email: 'alice@email.com',
        phone: '555-0101',
        address: '123 Maple St',
        medicalHistory: 'Asthma',
        allergies: 'Penicillin',
        notes: 'Allergic to penicillin',
        registeredBy: users[1]._id, // reception user
      },
      {
        name: 'Bob Williams',
        age: 45,
        gender: 'Male',
        email: 'bob@email.com',
        phone: '555-0102',
        address: '456 Oak Ave',
        medicalHistory: 'Hypertension',
        allergies: 'None',
        notes: 'Hypertension history',
        registeredBy: users[1]._id,
      },
      {
        name: 'Charlie Brown',
        age: 28,
        gender: 'Male',
        email: 'charlie@email.com',
        phone: '555-0103',
        address: '789 Pine Ln',
        medicalHistory: 'None',
        allergies: 'None',
        notes: 'Annual checkup',
        registeredBy: users[1]._id,
      },
      {
        name: 'Diana Prince',
        age: 30,
        gender: 'Female',
        email: 'diana@email.com',
        phone: '555-0104',
        address: '321 Elm St',
        medicalHistory: 'Pregnancy',
        allergies: 'None',
        notes: 'Pregnancy week 12',
        registeredBy: users[1]._id,
      },
      {
        name: 'Evan Wright',
        age: 52,
        gender: 'Male',
        email: 'evan@email.com',
        phone: '555-0105',
        address: '654 Birch Rd',
        medicalHistory: 'Post-surgery',
        allergies: 'None',
        notes: 'Post-surgery recovery',
        registeredBy: users[1]._id,
      },
    ]);

    console.log('Created patients:', patients.length);

    // Create appointments
    const appointments = await Appointment.create([
      {
        patientId: patients[0]._id,
        doctorId: users[2]._id, // doctor user
        date: new Date('2026-02-18T09:00:00'),
        time: '09:00',
        status: 'Completed',
        reason: 'Routine checkup',
        duration: 30,
        createdBy: users[1]._id,
      },
      {
        patientId: patients[1]._id,
        doctorId: users[2]._id,
        date: new Date('2026-02-18T10:00:00'),
        time: '10:00',
        status: 'Scheduled',
        reason: 'Blood pressure check',
        duration: 30,
        createdBy: users[1]._id,
      },
      {
        patientId: patients[2]._id,
        doctorId: users[2]._id,
        date: new Date('2026-02-19T09:00:00'),
        time: '09:00',
        status: 'Scheduled',
        reason: 'Annual physical',
        duration: 45,
        createdBy: users[1]._id,
      },
      {
        patientId: patients[3]._id,
        doctorId: users[2]._id,
        date: new Date('2026-02-19T11:00:00'),
        time: '11:00',
        status: 'Scheduled',
        reason: 'Prenatal exam',
        duration: 40,
        createdBy: users[1]._id,
      },
    ]);

    console.log('Created appointments:', appointments.length);

    // Create billing records
    const billing = await Billing.create([
      {
        patientId: patients[0]._id,
        appointmentId: appointments[0]._id,
        amount: 150.0,
        description: 'Consultation Fee',
        status: 'Paid',
        paymentMethod: 'Cash',
        paymentDate: new Date('2026-02-18'),
        createdBy: users[1]._id,
      },
      {
        patientId: patients[1]._id,
        appointmentId: appointments[1]._id,
        amount: 200.0,
        description: 'X-Ray and Consultation',
        status: 'Pending',
        paymentMethod: null,
        dueDate: new Date('2026-03-18'),
        createdBy: users[1]._id,
      },
    ]);

    console.log('Created billing records:', billing.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
