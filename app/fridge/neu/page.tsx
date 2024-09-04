import { auth } from "@/auth";
import { userInDb } from "@/components/Registration/registrationServerActions";
//import AddEventForm from "@/components/Veranstaltungen/AddEventForm";
import prisma from "@/prisma/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Neuer Kühlschrank",
};

export default async function NewFridgePage() {
    //const venues = await prisma.venue.findMany();
    //const categories = await prisma.category.findMany();

    const session = await auth();
    if (!session) {
        redirect("/");
    }

    const userProfile = await userInDb(session?.user?.email);
    if (!userProfile) {
        redirect("/profile/new");
    }

    return (
        <div>
            <h1>neue Kühlschrank anlegen</h1>
            {/* <AddEventForm venues={venues} categories={categories} /> */}
        </div>
    );
}
