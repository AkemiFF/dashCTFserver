import UsersLayout from '@/components/layout/UserLayout';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../i18n';
import './globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const isAdminPage = router.pathname.startsWith('/private-zone-0x8a7b6c');

  return isAdminPage ? (
    <Component {...pageProps} />
  ) : (
    <UsersLayout>
      <Component {...pageProps} />
    </UsersLayout>
  );
}

export default MyApp;
