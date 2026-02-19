# Frontend-Backend Integration Guide

This guide shows how to integrate your React frontend with the CareLINK backend API.

## Step 1: Update API Base URL

Create a configuration file for API endpoints:

**frontend/api.config.js** (or similar):
```javascript
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GET_ME: `${API_BASE_URL}/auth/me`,

  // Users
  GET_USERS: `${API_BASE_URL}/users`,
  GET_USER: (id) => `${API_BASE_URL}/users/${id}`,
  UPDATE_USER: (id) => `${API_BASE_URL}/users/${id}`,
  DELETE_USER: (id) => `${API_BASE_URL}/users/${id}`,

  // Patients
  GET_PATIENTS: `${API_BASE_URL}/patients`,
  GET_PATIENT: (id) => `${API_BASE_URL}/patients/${id}`,
  CREATE_PATIENT: `${API_BASE_URL}/patients`,
  UPDATE_PATIENT: (id) => `${API_BASE_URL}/patients/${id}`,
  DELETE_PATIENT: (id) => `${API_BASE_URL}/patients/${id}`,

  // Appointments
  GET_APPOINTMENTS: `${API_BASE_URL}/appointments`,
  GET_APPOINTMENT: (id) => `${API_BASE_URL}/appointments/${id}`,
  CREATE_APPOINTMENT: `${API_BASE_URL}/appointments`,
  UPDATE_APPOINTMENT: (id) => `${API_BASE_URL}/appointments/${id}`,
  DELETE_APPOINTMENT: (id) => `${API_BASE_URL}/appointments/${id}`,
  GET_PATIENT_APPOINTMENTS: (patientId) => `${API_BASE_URL}/appointments/patient/${patientId}`,
  GET_DOCTOR_SCHEDULE: (doctorId) => `${API_BASE_URL}/appointments/doctor/${doctorId}/schedule`,

  // Billing
  GET_BILLING: `${API_BASE_URL}/billing`,
  GET_BILLING_RECORD: (id) => `${API_BASE_URL}/billing/${id}`,
  CREATE_BILLING: `${API_BASE_URL}/billing`,
  UPDATE_BILLING: (id) => `${API_BASE_URL}/billing/${id}`,
  DELETE_BILLING: (id) => `${API_BASE_URL}/billing/${id}`,
  GET_PATIENT_BILLING: (patientId) => `${API_BASE_URL}/billing/patient/${patientId}`,
  MARK_PAID: (id) => `${API_BASE_URL}/billing/${id}/mark-paid`,
};
```

## Step 2: Create API Service

**frontend/services/apiService.js**:
```javascript
import { API_ENDPOINTS } from '../api.config';

const getAuthHeader = () => {
  const token = localStorage.getItem('carelink_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const apiCall = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: getAuthHeader(),
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Auth Service
export const authService = {
  login: (username, password) =>
    apiCall(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (userData) =>
    apiCall(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () =>
    apiCall(API_ENDPOINTS.GET_ME),
};

// Users Service
export const usersService = {
  getAll: () =>
    apiCall(API_ENDPOINTS.GET_USERS),

  getById: (id) =>
    apiCall(API_ENDPOINTS.GET_USER(id)),

  update: (id, userData) =>
    apiCall(API_ENDPOINTS.UPDATE_USER(id), {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.DELETE_USER(id), {
      method: 'DELETE',
    }),
};

// Patients Service
export const patientsService = {
  getAll: () =>
    apiCall(API_ENDPOINTS.GET_PATIENTS),

  getById: (id) =>
    apiCall(API_ENDPOINTS.GET_PATIENT(id)),

  create: (patientData) =>
    apiCall(API_ENDPOINTS.CREATE_PATIENT, {
      method: 'POST',
      body: JSON.stringify(patientData),
    }),

  update: (id, patientData) =>
    apiCall(API_ENDPOINTS.UPDATE_PATIENT(id), {
      method: 'PUT',
      body: JSON.stringify(patientData),
    }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.DELETE_PATIENT(id), {
      method: 'DELETE',
    }),
};

// Appointments Service
export const appointmentsService = {
  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiCall(`${API_ENDPOINTS.GET_APPOINTMENTS}${query ? '?' + query : ''}`);
  },

  getById: (id) =>
    apiCall(API_ENDPOINTS.GET_APPOINTMENT(id)),

  create: (appointmentData) =>
    apiCall(API_ENDPOINTS.CREATE_APPOINTMENT, {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),

  update: (id, appointmentData) =>
    apiCall(API_ENDPOINTS.UPDATE_APPOINTMENT(id), {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.DELETE_APPOINTMENT(id), {
      method: 'DELETE',
    }),

  getPatientAppointments: (patientId) =>
    apiCall(API_ENDPOINTS.GET_PATIENT_APPOINTMENTS(patientId)),

  getDoctorSchedule: (doctorId, date) => {
    const query = date ? `?date=${date}` : '';
    return apiCall(`${API_ENDPOINTS.GET_DOCTOR_SCHEDULE(doctorId)}${query}`);
  },
};

// Billing Service
export const billingService = {
  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiCall(`${API_ENDPOINTS.GET_BILLING}${query ? '?' + query : ''}`);
  },

  getById: (id) =>
    apiCall(API_ENDPOINTS.GET_BILLING_RECORD(id)),

  create: (billingData) =>
    apiCall(API_ENDPOINTS.CREATE_BILLING, {
      method: 'POST',
      body: JSON.stringify(billingData),
    }),

  update: (id, billingData) =>
    apiCall(API_ENDPOINTS.UPDATE_BILLING(id), {
      method: 'PUT',
      body: JSON.stringify(billingData),
    }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.DELETE_BILLING(id), {
      method: 'DELETE',
    }),

  getPatientBilling: (patientId) =>
    apiCall(API_ENDPOINTS.GET_PATIENT_BILLING(patientId)),

  markAsPaid: (id, paymentMethod) =>
    apiCall(API_ENDPOINTS.MARK_PAID(id), {
      method: 'PUT',
      body: JSON.stringify({ paymentMethod }),
    }),
};
```

## Step 3: Update AuthContext

**Replace your current AuthContext.js** with backend integration:

```javascript
const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [token, setToken] = React.useState(localStorage.getItem('carelink_token'));

  React.useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Optionally verify token with backend
          setLoading(false);
          const storedUser = localStorage.getItem('carelink_active_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message };
      }

      // Store token and user
      localStorage.setItem('carelink_token', data.token);
      localStorage.setItem('carelink_active_user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('carelink_token');
    localStorage.removeItem('carelink_active_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);
```

## Step 4: Update Component Data Fetching

**Example: Users page**:

```javascript
class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const token = localStorage.getItem('carelink_token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      this.setState({ users: data.users, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  deleteUser = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const token = localStorage.getItem('carelink_token');
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      this.fetchUsers();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  render() {
    const { users, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => this.deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Users;
```

## Step 5: Environment Variables

Create **.env** in frontend root:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 6: Test Integration

1. Start backend: `npm run dev` (from backend directory)
2. Start frontend: `npm start` (from frontend directory)
3. Try logging in with: `admin` / `admin123`
4. Check browser console for any errors
5. Open Network tab to see API calls

## Common Issues

### CORS Error
If you see CORS errors, ensure:
- Backend is running on port 5000
- Frontend makes requests to `http://localhost:5000/api`
- Backend has CORS enabled (it does by default)

### Token Not Being Sent
Ensure the Authorization header includes the token:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Request Failing
Check:
- Backend is running (`npm run dev` in backend folder)
- MongoDB is running
- Token is valid and stored in localStorage
- API endpoint URL is correct

## API Response Format Example

All responses follow this format:

**Success**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Production Deployment

When deploying to production:

1. Update `REACT_APP_API_URL` to your backend URL
2. Ensure backend is deployed (Heroku, AWS, DigitalOcean, etc.)
3. Update CORS origin in backend if needed
4. Use secure JWT_SECRET in production
5. Use MongoDB Atlas for database
6. Enable HTTPS for all requests
