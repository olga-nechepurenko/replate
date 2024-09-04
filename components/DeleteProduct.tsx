"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";

type Props = {
    id: number;
    fridgeId: number | null;
};

export async function DeleteProduct({ id, fridgeId }: Props) {
    return (
        <form
            action={async () => {
                "use server";
                await deleteProduct(id, fridgeId);
            }}
        >
            <button type="submit">löschen</button>
        </form>
    );
}

export async function deleteProduct(id: number, fridgeId: number | null) {
    await prisma.foodItem
        .delete({
            where: {
                id,
            },
        })
        .catch((err) => {
            console.log(err);
            return {
                message: "Ein Fehler ist aufgetreten!",
                status: "data-error",
            };
        });

    const successMessage = {
        message: "das Product wurde erfolgreich gelöscht",
        status: "success",
    };
    if (fridgeId) {
        revalidatePath(`/fridge/${fridgeId}`);
    }

    return successMessage;
}
