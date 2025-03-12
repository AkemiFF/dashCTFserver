import Head from "next/head";
import { Footer } from "../client/footer";
import { SiteHeader } from "../site-header";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Hackitech.co</title>
      </Head>
      <div className="users-layout">
        <SiteHeader unreadNotifications={3} />

        <main>{children}</main>
        <Footer />
      </div></>
  );
}
