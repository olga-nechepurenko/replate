import type { FoodItem, Fridge, Location } from "@prisma/client";
import Link from "next/link";
import { DeleteFridge } from "./DeleteFridge";
import { getDistance, getUserLocation } from "@/lib/helpers";
import axios from "redaxios";
import { AddTransaction } from "./AddTransaction";

type Props = { Fridge: Fridge | null } & FoodItem & {
        active: boolean;
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

    return (
        <article className="product-teaser">
            <Link
                className="fridge__link"
                href={active ? `/foodItemTransaction/${id}` : ""}
            >
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
            </Link>
            {active && <AddTransaction foodItemId={id} />}
        </article>
    );
}
