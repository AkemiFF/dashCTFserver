import UsersLayout from '@/components/layout/UserLayout';
import { Toaster } from "@/components/ui/toaster";
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../i18n';
import './globals.css';
const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const isAdminPage = router.pathname.startsWith('/private-zone-0x8a7b6c');

  return isAdminPage ? (
    <>
      <Toaster />
      <Component {...pageProps} /></>
  ) : (
    <UsersLayout>
      <Toaster />

      <Component {...pageProps} />
    </UsersLayout>
  );
}

export default MyApp;
