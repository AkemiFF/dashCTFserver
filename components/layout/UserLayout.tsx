import Head from "next/head";
import { SiteHeader } from "../site-header";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Hackitech.co</title>
      </Head>
      <div className="users-layout">
        {/* {typeof window !== 'undefined' && !window.location.pathname.match(/\/learn\/courses\/\d+\/modules\/\d+/) && <SiteHeader unreadNotifications={3} />} */}
        <SiteHeader unreadNotifications={3} />
        <main>{children}</main>
        {/* {typeof window !== 'undefined' && !window.location.pathname.match(/\/learn\/courses\/\d+\/modules\/\d+/) &&
          <Footer />} */}

      </div>
    </>
  );
}
