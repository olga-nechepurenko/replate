"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { userInDb } from "./Registration/registrationServerActions";
import SubmitButton from "./SubmitButton";

export async function AddTransaction({ foodItemId }: { foodItemId: number }) {
    const foodItem = await prisma.foodItem.findUnique({
        where: {
            id: foodItemId ?? 0,
        },
        include: {
            Fridge: {
                include: {
                    Location: true,
                    User: true,
                },
            },
        },
    });

    const session = await auth();
    const userEmail = session?.user.email ?? "";
    const currentUserProfile = await userInDb(userEmail);

    if (
        !foodItem ||
        !currentUserProfile ||
        !session ||
        !foodItem.Fridge ||
        !foodItem.Fridge.User
    ) {
        return (
            <>
                <button className="btn-take" disabled={true}>
                    RETTEN
                </button>
            </>
        );
    }

    return (
        <form
            action={async () => {
                "use server";
                await createTransaction(
                    foodItem.id,
                    foodItem.Fridge?.User?.id ?? null,
                    currentUserProfile.id,
                    foodItem.title,
                    foodItem.Fridge?.User?.username ?? null,
                    currentUserProfile.username
                );
            }}
        >
            <SubmitButton
                className="btn-take"
                pendingContent="lege Transaction an.."
                readyContent="RETTEN"
            />
        </form>
    );
}

async function createTransaction(
    foodItemId: number,
    giverId: number | null,
    currentUserId: number,
    foodItemTitle: string,
    giverName: string | null,
    currentUsername: string
) {
    if (
        !giverId ||
        !currentUserId ||
        !foodItemId ||
        giverId === currentUserId
    ) {
        return;
    }

    //check if transaction already exists
    const transactionExists = await prisma.transaction.findFirst({
        where: {
            foodItemId,
            receiverId: currentUserId,
        },
    });

    if (transactionExists) {
        return;
    }

    //create transaction
    await prisma.transaction
        .create({
            data: {
                foodItemId,
                giverId,
                receiverId: currentUserId,
                status: "PENDING",
                transactionDate: new Date(),
            },
        })
        .catch((err) => {
            console.log(err);
        });

    //create message
    await prisma.message
        .create({
            data: {
                content: `Hey ${giverName ?? ""}! Ich würde gerne ${
                    foodItemTitle ?? "das Product"
                } retten! Gib mir Bescheid wann und wo! Libe Grüße ${currentUsername}!`,
                senderId: currentUserId,
                receiverId: giverId,
                foodItemId,
            },
        })
        .catch((err) => {
            console.log(err);
        });

    revalidatePath(`/explore`);

    return;
}
