import Link from "next/link";

import styles from "./header.module.css";
import Navbar from "./Navbar";
import { verifyTokenForPage } from "@/utils/token";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

const Header = async () => {
  const token = verifyTokenForPage((await cookies()).get("token")?.value || "");

  return (
    <header className={styles.header}>
      <Navbar isAdmin={token?.isAdmin || false} />
      <div className={styles.actions}>
        {token ? (
          <>
            <Link
              href="/profile"
              className="text-blue-800 font-bold md:text-xl capitalize"
            >
              {token?.username}
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className={styles.btn}>
              Login
            </Link>
            <Link href="/register" className={styles.btn}>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
