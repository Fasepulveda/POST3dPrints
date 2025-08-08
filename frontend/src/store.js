import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import cartReducer from './features/cartSlice';
import productsReducer from './features/productsSlice';
import ordersReducer from './features/ordersSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productsReducer,
    orders: ordersReducer,
  },
});

export default store;
