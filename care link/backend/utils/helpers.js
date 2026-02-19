// Utility functions

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const formatDateTime = (date) => {
  return new Date(date).toISOString();
};

const calculateAge = (birthDate) => {
  const today = new Date();
  const born = new Date(birthDate);
  let age = today.getFullYear() - born.getFullYear();
  const monthDiff = today.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) {
    age--;
  }
  return age;
};

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const isValidPhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone);
};

const paginate = (arr, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    data: arr.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: arr.length,
      pages: Math.ceil(arr.length / limit),
    },
  };
};

const sortBy = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

module.exports = {
  generateId,
  formatDate,
  formatDateTime,
  calculateAge,
  isValidEmail,
  isValidPhone,
  paginate,
  sortBy,
};
