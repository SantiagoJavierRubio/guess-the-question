import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { UserImage } from "./User/UserImage";

import styles from "../styles/navbar.module.css";


export const NavBar: React.FC = () => {
    const { data: sessionData } = useSession();
  
    return (
      <nav className={styles.navbar}>
        <div className={styles.logo}>LOGO</div>
        <div className={styles.navLinkContainer}>
          <Link className={styles.navLink} href="/">🏠 Home</Link>
          <Link className={styles.navLink} href="/create">📝 Create</Link>
        </div>
        <div className={styles.authContainer}>
            {sessionData?.user && (
              <div className={styles.userData}>
                <UserImage 
                  url={sessionData.user.image}
                  username={sessionData.user.name || undefined}
                  width={35}
                  height={35}
                />
                <p className={styles.username}>
                    {sessionData.user?.name}
                </p>
              </div>
            )}
            <button
                className={styles.authBtn}
                onClick={sessionData ? () => signOut() : () => signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div>
      </nav>
    );
  };
  