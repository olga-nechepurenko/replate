"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function DeleteProfile({ email }: { email: string }) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return;
    }
    return (
        <form
            action={async () => {
                "use server";
                await deleteUser(user.id);
            }}
        >
            <button type="submit">Profile löschen</button>
        </form>
    );
}

async function deleteUser(id: number) {
    await prisma.fridge
        .deleteMany({
            where: {
                userId: id,
            },
        })
        .catch((err) => {
            console.log(err);
        });
    //if (user.locationId) {
    //     await prisma.location
    //         .delete({
    //             where: {
    //                 id: user.locationId,
    //             },
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }

    await prisma.user.delete({
        where: {
            id,
        },
    });
    revalidatePath("/register");
}
