"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";

type Props = {
    id: number;
    receiverId: number | null;
    giverId: number | null;
};

export async function DeleteTransaction({ id, receiverId, giverId }: Props) {
    return (
        <form
            action={async () => {
                "use server";
                await deleteTransaction(id, receiverId, giverId);
            }}
        >
            <button className="transaction-button" type="submit">
                löschen
            </button>
        </form>
    );
}

export async function deleteTransaction(
    id: number,
    receiverId: number | null,
    giverId: number | null
) {
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

    const successMessage = {
        message: "die Transaction wurde erfolgreich gelöscht",
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
