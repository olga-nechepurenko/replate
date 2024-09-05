"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";

type Props = {
    id: number;
    receiverId: number | null;
    giverId: number | null;
    foodItemId: number;
};

export async function PickedUpButton({
    id,
    receiverId,
    giverId,
    foodItemId,
}: Props) {
    return (
        <form
            action={async () => {
                //delete transaction and product
                "use server";
                await deleteTransactionProduct(
                    id,
                    receiverId,
                    giverId,
                    foodItemId
                );
            }}
        >
            <button className="transaction-button" type="submit">
                abgeholt
            </button>
        </form>
    );
}

export async function deleteTransactionProduct(
    id: number,
    receiverId: number | null,
    giverId: number | null,
    foodItemId: number
) {
    //delete transaction
    await prisma.transaction
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

    //delete product
    await prisma.foodItem
        .delete({
            where: {
                id: foodItemId,
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
        message: "das Product und die Transaction wurde erfolgreich gelöscht",
        status: "success",
    };

    if (receiverId !== null) {
        revalidatePath(`/transactions/${receiverId}`);
    }
    if (giverId !== null) {
        revalidatePath(`/transactions/${giverId}`);
    }

    return successMessage;
}
