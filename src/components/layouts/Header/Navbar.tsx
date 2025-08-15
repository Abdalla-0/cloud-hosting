"use client";
import { GrTechnology } from "react-icons/gr";
import Link from "next/link";
import styles from "./header.module.css";
import { AiOutlineMenu } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
interface NavbarProps {
  isAdmin: boolean ;
}
const Navbar = ({ isAdmin }: NavbarProps) => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className={styles.navbar}>
      <div>
        <Link href="/" className={styles.logo}>
          CLOUD <GrTechnology /> HOSTING
        </Link>
        <div className={styles.menu} onClick={() => setToggle(!toggle)}>
          {toggle ? <AiOutlineClose /> : <AiOutlineMenu />}
        </div>
      </div>
      <div
        className={styles.navLinksWrapper}
        style={{
          clipPath: (toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)") || "",
        }}
      >
        <ul className={styles.navLinks}>
          <li>
            <Link
              href="/"
              className={styles.navLink}
              onClick={() => setToggle(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/articles"
              className={styles.navLink}
              onClick={() => setToggle(false)}
            >
              Articles
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={styles.navLink}
              onClick={() => setToggle(false)}
            >
              About
            </Link>
          </li>
          <li>
            {isAdmin && (
              <Link
                href="/admin"
                className={styles.navLink}
                onClick={() => setToggle(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
