import prisma from "@/prisma/db";
import Link from "next/link";
//import SignatureToCheck from "./SignatureToCheck";

export default async function AddFridge({ email }: { email: string }) {
    const profile = await prisma.user.findUnique({
        where: {
            email: email,
        },
        include: {
            Location: true,
        },
    });

    if (!profile) {
        return <></>;
    }

    const friges = await prisma.fridge.findMany({
        where: {
            userId: profile.id,
        },
    });

    console.log(friges.length);

    if (friges.length > 0) {
        return (
            <>
                <Link href={`/fridges/${profile.id}`}>
                    zum meiner Kuhlschrank
                </Link>
            </>
        );
    }

    if (profile.locationId && profile.locationId !== null) {
        const fridge = await prisma.fridge.create({
            data: {
                fridgeTitle: "Home",
                userId: profile.id,
                Location: {
                    connect: {
                        id: profile.locationId,
                    },
                },
            },
        });
    }

    return (
        <>
            <h3>3. Füge die Produkte hinzu:</h3>
            <Link href={`/fridges/${profile.id}`}>
                Produkte zum shared Kuhlschrank hinzufügen
            </Link>
        </>
    );
}
