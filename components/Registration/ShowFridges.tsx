import prisma from "@/prisma/db";
import Link from "next/link";

export default async function ShowFridges({ email }: { email: string }) {
    const profile = await prisma.user.findUnique({
        where: {
            email,
        },
        include: {
            Location: true,
        },
    });

    if (!profile) {
        return <></>;
    }

    const fridges = await prisma.fridge.findMany({
        where: {
            userId: profile.id,
        },
    });

    console.log(fridges.length);

    if (!fridges || fridges.length === 0) {
        return;
    }

    if (fridges.length > 1) {
        return (
            <>
                <Link href={`/fridges/${profile.id}`}>
                    zur meinen Kühlschränken
                </Link>
            </>
        );
    }

    // if (profile.locationId && profile.locationId !== null) {
    //     const fridge = await prisma.fridge.create({
    //         data: {
    //             fridgeTitle: "Home",
    //             userId: profile.id,
    //             locationId: profile.locationId,
    //             defaultLocation: profile.defaultLocation,
    //         },
    //     });
    //     console.log(fridge);
    // }

    return (
        <>
            <h3>3. Füge die Produkte hinzu:</h3>
            <Link href={`/fridge/${fridges[0].id}`}>
                Produkte zum shared Kühlschrank hinzufügen
            </Link>
        </>
    );
}
