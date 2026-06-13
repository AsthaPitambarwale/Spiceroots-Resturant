import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </AppProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}