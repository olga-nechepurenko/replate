import { auth } from "@/auth";
import { SignIn } from "@/components/Auth/SignIn";
import RegistratingForm from "@/components/Registration/RegistratingForm";
import { userInDb } from "@/components/Registration/registrationServerActions";
import ShowFridges from "@/components/Registration/ShowFridges";

import { IoCheckboxOutline } from "react-icons/io5";

const session = await auth();

export default async function RegistratingPage() {
    const email = session?.user?.email ?? "";
    const user = await userInDb(email);

    return (
        <div>
            <h1>WILLKOMMEN zu rePLATE!</h1>
            <p>um in 5 Minuten loszulegen, folge den Anweisungen:</p>
            <h3>1. SignIn mit deinem Konto:</h3>
            {session ? (
                <>
                    <p>
                        <IoCheckboxOutline /> Angemeldet als {session.user.name}
                    </p>
                </>
            ) : (
                <div>
                    <SignIn />
                </div>
            )}
            <h3>2. Lege dein Profil ein:</h3>
            <RegistratingForm email={email} user={user} edit={false} />
            {session && <ShowFridges email={email} />}
        </div>
    );
}
