'use client';

import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Calendar } from 'lucide-react';

interface MonthYearInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function MonthYearInput({
  value,
  onChange,
  label,
  placeholder = 'MM/YYYY',
  className = '',
  error,
}: MonthYearInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  // Convert YYYY-MM format to MM/YYYY for display
  useEffect(() => {
    if (value) {
      if (value.match(/^\d{4}-\d{2}/)) {
        // YYYY-MM format -> MM/YYYY
        const [year, month] = value.split('-');
        setDisplayValue(`${month}/${year}`);
      } else if (value.match(/^\d{2}\/\d{4}/)) {
        // Already MM/YYYY format
        setDisplayValue(value);
      } else {
        setDisplayValue('');
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const validateMonthYear = (input: string): boolean => {
    // Check format MM/YYYY
    const match = input.match(/^(\d{2})\/(\d{4})$/);
    if (!match) return false;

    const month = parseInt(match[1]);
    const year = parseInt(match[2]);

    // Validate month (01-12) and year (reasonable range)
    return month >= 1 && month <= 12 && year >= 1900 && year <= 2100;
  };

  const formatInput = (input: string): string => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');

    // Format as MM/YYYY
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 6)}`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatInput(input);
    setDisplayValue(formatted);

    // Validate and update parent only if valid or empty
    if (formatted === '') {
      setIsValid(true);
      onChange('');
    } else if (formatted.length === 7) {
      // Complete input MM/YYYY
      const valid = validateMonthYear(formatted);
      setIsValid(valid);

      if (valid) {
        // Convert to YYYY-MM format for storage
        const [month, year] = formatted.split('/');
        onChange(`${year}-${month}`);
      }
    } else {
      // Incomplete input
      setIsValid(true); // Don't show error while typing
    }
  };

  const handleBlur = () => {
    // Validate on blur
    if (displayValue && displayValue.length === 7) {
      const valid = validateMonthYear(displayValue);
      setIsValid(valid);

      if (!valid) {
        // Clear invalid input
        setDisplayValue('');
        onChange('');
      }
    } else if (displayValue && displayValue.length < 7) {
      // Incomplete input on blur - clear it
      setDisplayValue('');
      onChange('');
      setIsValid(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl/Cmd+A, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X
      ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) &&
        (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }

    // Ensure that it's a number and stop the keypress if it's not
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className={className}>
      <label className="label">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={7}
          className={`input-field pr-10 ${!isValid || error ? 'border-error' : ''}`}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Helper text */}
      <div className="mt-1 flex items-start justify-between">
        <p className="text-xs text-gray-500">
          {placeholder === 'MM/YYYY' ? 'Ví dụ: 01/2021' : placeholder}
        </p>
        {displayValue && displayValue.length < 7 && (
          <p className="text-xs text-amber-600">
            {displayValue.length}/7
          </p>
        )}
      </div>

      {/* Error message */}
      {!isValid && (
        <p className="mt-1 text-xs text-error">
          Định dạng không hợp lệ. Vui lòng nhập theo định dạng MM/YYYY (01/2021)
        </p>
      )}
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
}
