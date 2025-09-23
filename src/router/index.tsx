import { Routes, Route } from 'react-router-dom';
import {
  AdvertisementDetail,
  Chat,
  CreateAdvertisement,
  EditAdvertisement,
  Home,
  Login,
  Messages,
  MyAdvertisements,
  Register,
} from '@/pages';
import { ProtectedRoute, PublicRoute } from '@/components/auth';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route path="/advertisement/:id" element={<AdvertisementDetail />} />
      <Route path="/advertisement/edit/:id" element={<EditAdvertisement />} />

      <Route
        path="/create-advertisement"
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
      <Route
        path="/messages/:userId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
