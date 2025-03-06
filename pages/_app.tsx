import UsersLayout from '@/components/layout/UserLayout';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../i18n';
import '../styles/globals.css';
import './globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const isUsersPage = router.pathname.startsWith('/users');

  return isUsersPage ? (
    <UsersLayout>
      <Component {...pageProps} />
    </UsersLayout>
  ) : (
    <Component {...pageProps} />
  );
}

export default MyApp;
