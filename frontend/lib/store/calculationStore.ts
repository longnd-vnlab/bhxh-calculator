import { create } from 'zustand';
import type { Period, CalculationResult, OCRResult } from '../types';

interface CalculationStore {
  periods: Period[];
  calculationResult: CalculationResult | null;
  ocrResults: OCRResult[];
  isLoading: boolean;

  // Period management
  addPeriod: (period: Period) => void;
  removePeriod: (id: string) => void;
  updatePeriod: (id: string, period: Partial<Period>) => void;
  clearPeriods: () => void;
  setPeriods: (periods: Period[]) => void;

  // Calculation
  setCalculationResult: (result: CalculationResult | null) => void;
  setLoading: (loading: boolean) => void;

  // OCR
  addOCRResult: (result: OCRResult) => void;
  updateOCRResult: (imageId: string, updates: Partial<OCRResult>) => void;
  clearOCRResults: () => void;
  mergeOCRPeriods: () => void;
}

export const useCalculationStore = create<CalculationStore>((set, get) => ({
  periods: [],
  calculationResult: null,
  ocrResults: [],
  isLoading: false,

  addPeriod: (period) =>
    set((state) => ({
      periods: [...state.periods, period],
    })),

  removePeriod: (id) =>
    set((state) => ({
      periods: state.periods.filter((p) => p.id !== id),
    })),

  updatePeriod: (id, updates) =>
    set((state) => ({
      periods: state.periods.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  clearPeriods: () => set({ periods: [] }),

  setPeriods: (periods) => set({ periods }),

  setCalculationResult: (result) => set({ calculationResult: result }),

  setLoading: (loading) => set({ isLoading: loading }),

  addOCRResult: (result) =>
    set((state) => ({
      ocrResults: [...state.ocrResults, result],
    })),

  updateOCRResult: (imageId, updates) =>
    set((state) => ({
      ocrResults: state.ocrResults.map((r) =>
        r.imageId === imageId ? { ...r, ...updates } : r
      ),
    })),

  clearOCRResults: () => set({ ocrResults: [] }),

  mergeOCRPeriods: () => {
    const { ocrResults } = get();
    const allPeriods: Period[] = [];

    ocrResults.forEach((result) => {
      if (result.status === 'success' && result.extractedPeriods) {
        allPeriods.push(...result.extractedPeriods);
      }
    });

    // Sort by start date
    allPeriods.sort((a, b) => a.start_date.localeCompare(b.start_date));

    set({ periods: allPeriods });
  },
}));
