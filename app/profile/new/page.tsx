import { auth } from "@/auth";
import RegistratingForm from "@/components/Registration/RegistratingForm";
import { userInDb } from "@/components/Registration/registrationServerActions";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Neues Profil erstellen",
};

export default async function NewProfilePage() {
    const session = await auth();
    const email = session?.user?.email ?? "";
    const user = await userInDb(email);

    if (!session) {
        redirect("/");
    }

    return (
        <div>
            <h1>Profil erstellen</h1>
            <RegistratingForm email={email} user={user} edit={false} />
        </div>
    );
}
