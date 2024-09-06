"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";

type Props = {
    id: number;
    userId: number | null;
};

export async function DeleteFridge({ id, userId }: Props) {
    return (
        <form
            className="btn-delete-fridge-list"
            action={async () => {
                //delete fridge and products
                "use server";
                await deleteFridge(id, userId);
                revalidatePath(`/fridges/${userId}`);
            }}
        >
            <button type="submit">löschen</button>
        </form>
    );
}

export async function deleteFridge(id: number, userId: number | null) {
    //delete all products in fridge
    await prisma.foodItem
        .deleteMany({
            where: {
                fridgeId: id,
            },
        })
        .catch((err) => {
            console.log(err);
            return {
                message: "Ein Fehler ist aufgetreten!",
                status: "data-error",
            };
        });

    //delete fridge
    await prisma.fridge
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
    if (userId) {
        revalidatePath(`/fridges/${userId}`);
    }

    return successMessage;
}
