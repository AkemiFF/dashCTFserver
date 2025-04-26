import UsersLayout from '@/components/layout/UserLayout';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../i18n';
import './globals.css';
import "./osint.css";
const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const isAdminPage = router.pathname.startsWith('/private-zone-0x8a7b6c');

  return isAdminPage ? (
    <>
      <Toaster />
      <Component {...pageProps} /></>
  ) : (
    <UsersLayout>
      <AuthProvider>
        <Toaster />

        <Component {...pageProps} />
      </AuthProvider>
    </UsersLayout>
  );
}

export default MyApp;
