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
                //TODO show confirm dialog "Are you sure?"; from server side
                // const confirmed = window.confirm(
                //     "Kühlschrank und alle Produkte löschen?"
                // );
                // if (confirmed) {

                // } else {
                //     // The user clicked "Cancel", so do nothing
                //     console.log("Delete action canceled");
                // }
                //delete fridge and products
                "use server";
                await deleteFridge(id, userId);
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
