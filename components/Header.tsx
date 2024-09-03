import { auth } from "@/auth";
import { SignIn } from "./Auth/SignIn";
import { SignOut } from "./Auth/SignOut";
import Image from "next/image";
import logo from "@/images/logo.png";
import UserNavigation from "./UserNavigation";
import { DeleteProfile } from "./Registration/DeleteProfile";

export default async function Header() {
    const session = await auth();
    const email = session?.user?.email ?? "";
    return (
        <header className="grid-container">
            <div className="grid-item">
                <Image
                    alt="meal"
                    src={logo}
                    sizes="(max-height: 2rem) 90vw,  2rem"
                    placeholder="blur"
                />
            </div>
            <div className="grid-item-user">
                {session ? (
                    <UserNavigation
                        {...session.user}
                        slot={
                            <>
                                <SignOut />
                                <DeleteProfile email={email} />
                            </>
                        }
                    />
                ) : (
                    <SignIn />
                )}
            </div>
        </header>
    );
}
