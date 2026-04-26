"use client";
import Link from "next/link";
import Image from "next/image";
import Navitems from "./navitems";
import Userdropdown from "./userdropdown";
 const Header=()=>
{
    return(
        
                    <header className="Sticky top-0 header">
                        <div className="container header-wrapper">

                            <Link href="/">
                                        <Image 
                                         src="/assets/icons/logo.svg" 
                                            alt="Signalist logo" 
                                            width={140} 
                                             height={32} /* Fixed: changed [32] to {32} */
                                            className="h-8 w-auto cursor-pointer" />
                             </Link>
                             <nav className="hidden sm:block">
                                <Navitems>

                                </Navitems>
                             </nav>
                             <Userdropdown>
                                
                             </Userdropdown>
                        </div>

                    </header>

    );
}
export default Header