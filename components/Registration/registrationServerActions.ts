"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { wait } from "@/lib/helpers";
// export async function serverTest(count: number) {
//     console.log("Hallo auf dem Server!");

//     return Math.pow(count, 2);
// }

export async function userInDb(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
}

/* 1. Mit zfd ein Schema erstellen, dass zum Formular passt.
https://www.npmjs.com/package/zod-form-data
https://developer.mozilla.org/en-US/docs/Web/API/FormData
	2. Mit der Schema-Methode safeParse formData parsen.
	3. Die Daten in die Datenbank mit Hilfe von prisma eintragen
	4. Bonus: Vor dem Eintragen mit einer weiteren Datenbankanfrage
	prüfen, ob bereits ein Eintrag mit der Mailadresse existiert,
	und nur dann den neuen Eintrag machen, wenn die Mailadresse
	noch nicht in der Datenbank vorhanden ist.
	*/

/* Wichtig: Wenn das Formular useFormState nutzt, wird formData zum
zweiten Parameter, der erste ist der Startwert von useFormData */
export async function addUser(prevState: unknown, formData: FormData) {
    console.log(formData.get("lat"));
    const schema = zfd.formData({
        name: zfd.text(z.string().max(100)),
        email: zfd.text(z.string().email()),
        lat: zfd.text(z.coerce.number().positive()),
        lng: zfd.text(z.coerce.number().positive()),
        bio: zfd.text(z.string().max(500).optional()),
        privacy: z.literal("accept"),
        location: zfd.text(z.string().max(100)),
    });

    const { success, data, error } = schema.safeParse(formData);

    if (!success) {
        console.log(error);
        return {
            message: "Bitte überprüfen Sie Ihre Eingabe!",
            status: "data-error",
        };
    }

    const emailExists = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    const successMessage = {
        message:
            "Vielen Dank. Bitte prüfen Sie ihre Mailbox und bestätigen Sie die Mailadresse",
        status: "success",
    };

    await wait(4000);

    if (emailExists) {
        // Aus Datenschutzgründen nicht verraten, dass Mailadresse schon existiert
        return successMessage;
    }

    //find location with 2 parameter in db
    //check if location exists
    console.log(Number(data.lat), Number(data.lng));

    const locationExists = await prisma.location.findFirst({
        where: {
            AND: [
                {
                    lat: Number(data.lat),
                },
                {
                    lng: Number(data.lng),
                },
            ],
        },
    });

    if (locationExists) {
        //create user in db
        await prisma.user.create({
            data: {
                username: data.name,
                email: data.email,
                Location: {
                    connect: {
                        id: locationExists.id,
                    },
                },
                fridges: {
                    create: [
                        {
                            defaultLocation: data.location,
                            Location: {
                                connect: {
                                    id: locationExists.id,
                                },
                            },
                        },
                    ],
                },
                bio: data.bio,
                defaultLocation: data.location,
            },
        });
    } else {
        //create user and location in db
        const newUser = await prisma.user.create({
            data: {
                username: data.name,
                email: data.email,
                Location: {
                    create: {
                        lat: Number(data.lat),
                        lng: Number(data.lng),
                    },
                },
                bio: data.bio,
                defaultLocation: data.location,
            },
        });

        //create fridge in db
        await prisma.fridge.create({
            data: {
                userId: newUser.id,
                defaultLocation: data.location,
                locationId: newUser.locationId,
                fridgeTitle: "Home",
            },
        });
    }

    revalidatePath("/register");

    return successMessage;
}
