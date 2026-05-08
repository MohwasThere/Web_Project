"use client";
import Link from "next/link";
import Image from "next/image";
import Navitems from "./navitems";
import Userdropdown from "./userdropdown";

const Header = ({user } : {user:User}) => {
  return (
    <header className="header">
      <div className="container header-wrapper">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/assets/icons/logo.svg"
            alt="Signalist logo"
            width={120}
            height={28}
            className="h-7 w-auto cursor-pointer"
            priority
          />
        </Link>

        <nav className="hidden sm:block">
          <Navitems />
        </nav>

        <Userdropdown user={user}/>
      </div>
    </header>
  );
};

export default Header;
