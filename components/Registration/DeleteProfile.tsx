"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function DeleteProfile({ email }: { email: string }) {
    return (
        <form
            action={async () => {
                "use server";
                await deleteUser(email);
            }}
        >
            <button type="submit">Profile löschen</button>
        </form>
    );
}

async function deleteUser(email: string) {
    //await wait(1000);
    await prisma.user.delete({
        where: {
            email,
        },
    });
    revalidatePath("/register");
}
