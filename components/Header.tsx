import { auth } from "@/auth";
import { SignIn } from "./Auth/SignIn";
import { SignOut } from "./Auth/SignOut";
import Image from "next/image";
import logo from "@/images/logo.png";
import UserNavigation from "./UserNavigation";
import { DeleteProfile } from "./Registration/DeleteProfile";
import { userInDb } from "./Registration/registrationServerActions";
import Link from "next/link";
import { MessagesWidget } from "./MessagesWidget";

export default async function Header() {
    const session = await auth();
    const email = session?.user?.email ?? "";
    const profile = await userInDb(email);
    const profileId = profile?.id ?? null;

    //profileId
    return (
        <header className="grid-container">
            <div className="grid-item">
                <Link href={"/"}>
                    <Image
                        alt="meal"
                        src={logo}
                        sizes="(max-height: 2rem) 90vw,  2rem"
                        placeholder="blur"
                    />
                </Link>
            </div>
            <div className="grid-item-user">
                {session ? (
                    <>
                        <MessagesWidget email={email} />
                        <UserNavigation
                            {...session.user}
                            profileId={profileId}
                            slot={
                                <>
                                    <DeleteProfile email={email} />
                                    <SignOut />
                                </>
                            }
                        />
                    </>
                ) : (
                    <SignIn />
                )}
            </div>
        </header>
    );
}
