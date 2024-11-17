import { configureStore } from '@reduxjs/toolkit';
import barChartReducer from './slices/barChartSlice';

export const store = configureStore({
  reducer: {
    barChart: barChartReducer
  }
});

export default store;