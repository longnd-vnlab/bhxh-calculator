export const formatCurrency = (amount: number): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 ₫';

  try {
    if (typeof Intl !== 'undefined' && typeof Intl.NumberFormat !== 'undefined') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(amount);
    }

    // Fallback to manual formatting
    const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted} ₫`;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${Math.round(amount)} ₫`;
  }
};

export const formatNumber = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0';

  try {
    if (typeof Intl !== 'undefined' && typeof Intl.NumberFormat !== 'undefined') {
      return new Intl.NumberFormat('vi-VN').format(num);
    }

    // Fallback to manual formatting
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }

    // Check if Intl is available
    if (typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat !== 'undefined') {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    }

    // Fallback to manual formatting
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatDateInput = (dateString: string): string => {
  // Convert from YYYY-MM-DD to DD/MM/YYYY for display
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const parseDateInput = (dateString: string): string => {
  // Convert from DD/MM/YYYY to YYYY-MM-DD for API
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};
