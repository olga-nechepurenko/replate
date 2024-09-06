"use client";

import type { Fridge } from "@prisma/client";
import SubmitButton from "./SubmitButton";
import {
    createTransaction,
    getFoodItemWithUserlocation,
} from "./transactionServerActions";

type Props = {
    id: number;
    title: string;
    description: string;
    category: string;
    quantity: number;
    expirationDate: Date;
    locationId: number | null;
    photo: string | null;
    createdAt: Date;
    updatedAt: Date;
    Fridge: Fridge | null;
    active: boolean;
    key: number;
    username?: string | null;
    userid?: number | null;
};
export default function FoodItemTeaser({
    title,
    quantity,
    expirationDate,
    description,
    id,
    locationId,
    active,
    Fridge,
    username,
    userid,
}: Props) {
    const defaultLocation = Fridge!.defaultLocation;
    const getDifferenceInDays = () => {
        const currentDate = new Date(); // Current date and time
        const targetDate = expirationDate; // target date
        // Calculate the difference in time (milliseconds)
        const differenceInTime = targetDate.getTime() - currentDate.getTime();
        // Convert milliseconds into days
        const differenceInDays = Math.floor(
            differenceInTime / (1000 * 3600 * 24)
        );
        return differenceInDays;
    };

    const daysDifference = getDifferenceInDays();

    const handleAddTransaction = async (event: React.FormEvent) => {
        event.preventDefault();

        const foodItem = await getFoodItemWithUserlocation(id);
        if (
            !foodItem ||
            !foodItem.Fridge ||
            !foodItem.Fridge.User ||
            !userid ||
            !username
        ) {
            return;
        }
        await createTransaction(
            foodItem.id,
            foodItem.Fridge?.User?.id ?? null,
            userid,
            foodItem.title,
            foodItem.Fridge?.User?.username ?? null,
            username
        );
        return;
    };

    return (
        <article className="product-teaser">
            <h3>{title}</h3>
            <p>{description}</p>
            <strong>Menge: {quantity}</strong>

            {expirationDate && (
                <p>
                    Ablaufdatum: :
                    <strong>
                        in {daysDifference}
                        {daysDifference > 1 ? " Tagen" : " Tag"}
                    </strong>
                </p>
            )}

            {defaultLocation && (
                <>
                    <strong>{defaultLocation}</strong>
                </>
            )}

            {active && (
                <form onSubmit={handleAddTransaction}>
                    <SubmitButton
                        className="btn-take"
                        pendingContent="lege Transaction an.."
                        readyContent="RETTEN"
                    />
                </form>
            )}
        </article>
    );
}
