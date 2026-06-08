import { RouterProvider } from 'react-router';
import { router } from './routes';
import { env } from '@/lib/env';

// Initialize environment configuration
console.log(`[Rushd] App: ${env.get('APP_NAME')} v${env.get('APP_VERSION')}`);
console.log(`[Rushd] Environment: ${env.isProduction() ? 'production' : 'development'}`);

export default function App() {
  return <RouterProvider router={router} />;
}