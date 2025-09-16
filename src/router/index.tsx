import { Routes, Route } from 'react-router-dom';
import {
  AdvertisementDetail,
  CreateAdvertisement,
  Home,
  Login,
  Messages,
  MyAdvertisements,
  Profile,
  Register,
} from '@/pages';
import { ProtectedRoute } from '@/components/auth';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/advertisement/:id" element={<AdvertisementDetail />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateAdvertisement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-ads"
        element={
          <ProtectedRoute>
            <MyAdvertisements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
