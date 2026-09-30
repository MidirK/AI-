import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PickDrinkPage from './pages/PickDrinkPage';
import PickSnackPage from './pages/PickSnackPage';
import SpiritDetailPage from './pages/SpiritDetailPage';
import ComboDetailPage from './pages/ComboDetailPage';
import SavedPage from './pages/SavedPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="pick-drink" element={<PickDrinkPage />} />
        <Route path="pick-snack" element={<PickSnackPage />} />
        <Route path="spirits/:categoryId" element={<SpiritDetailPage />} />
        <Route path="combo/:categoryId/:snackId" element={<ComboDetailPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
