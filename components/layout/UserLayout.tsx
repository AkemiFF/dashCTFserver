import Head from "next/head";
import { Header } from "../client/header";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Hackitech.co</title>
      </Head>
      <div className="users-layout">
        <Header />
        <main>{children}</main>
        <footer>Users Footer</footer>
      </div></>
  );
}
