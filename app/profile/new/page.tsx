import { auth } from "@/auth";
import RegistratingForm from "@/components/Registration/RegistratingForm";
import { userInDb } from "@/components/Registration/registrationServerActions";
//import AddEventForm from "@/components/Veranstaltungen/AddEventForm";
import prisma from "@/prisma/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Neues Profil erstellen",
};

export default async function NewProfilePage() {
    //const venues = await prisma.venue.findMany();
    //const categories = await prisma.category.findMany();

    const session = await auth();
    const email = session?.user?.email ?? "";
    const user = await userInDb(email);

    if (!session) {
        redirect("/");
    }

    return (
        <div>
            <h1>Profil erstellen</h1>
            <RegistratingForm email={email} user={user} />
        </div>
    );
}
