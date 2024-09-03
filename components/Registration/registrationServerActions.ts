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

// export async function approveSignature(id: string, approve: boolean) {
//     /* Mit Hilfe von prisma die zur id passende Unterschrift entweder löschen
// 	oder den approved-Status auf true setzen. */
//     if (approve) {
//         await prisma.signature.update({
//             where: {
//                 id,
//             },
//             data: {
//                 approved: true,
//             },
//         });
//     } else {
//         await prisma.signature.delete({
//             where: {
//                 id,
//             },
//         });
//     }

//     /*
// 	Löscht den Cache für die angegebene Route und aktualisiert die Anzeige:
// 	https://nextjs.org/docs/app/api-reference/functions/revalidatePath */
//     revalidatePath("/petition");
// }

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
    //console.log(formData.get("privacy"));

    const schema = zfd.formData({
        name: zfd.text(z.string().max(100)),
        email: zfd.text(z.string().email()),
        location: zfd.text(z.coerce.number().positive().int().max(99999)),
        bio: zfd.text(z.string().max(500).optional()),
        privacy: z.literal("accept"),
    });

    const { success, data, error } = schema.safeParse(formData);

    if (!success) {
        console.log(error);
        return {
            message: "Bitte überprüfen Sie Ihre Eingabe!",
            status: "data-error",
        };
    }

    const emailExists = await prisma.signature.findUnique({
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

    await prisma.signature.create({
        data: {
            name: data.name,
            email: data.email,
        },
    });

    revalidatePath("/petition");

    return successMessage;
}
