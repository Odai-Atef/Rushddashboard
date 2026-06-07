import { RouterProvider } from 'react-router';
import { router } from './routes';

// Updated: 2026-06-07 - All routes configured and working
export default function App() {
  return <RouterProvider router={router} />;
}