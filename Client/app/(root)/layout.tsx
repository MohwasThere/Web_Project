'use-client'
import { Children } from "react";
import Header from "../../components/header";

const layout=({children}:{children:React.ReactNode})=>
{
    return(
        <main className="min-h-screen text-gary-400">
            <Header>
                
            </Header>
                    <div className="container py-10">
                            {children}
                    </div>
        </main>

    );
}
export default layout;
