import axios from 'axios';
import type { CalculationRequest, CalculationResult, Coefficient } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const calculationApi = {
  calculate: async (request: CalculationRequest): Promise<CalculationResult> => {
    const { data } = await api.post('/calculate', request);
    return data;
  },

  getCoefficients: async (): Promise<Coefficient[]> => {
    const { data } = await api.get('/coefficients');
    return data;
  },

  getCoefficientsByRange: async (
    startYear: number,
    endYear: number
  ): Promise<Coefficient[]> => {
    const { data } = await api.get('/coefficients/range', {
      params: { start_year: startYear, end_year: endYear },
    });
    return data;
  },
};

export const healthCheck = async (): Promise<{ status: string; version: string }> => {
  const { data } = await api.get('/health');
  return data;
};
