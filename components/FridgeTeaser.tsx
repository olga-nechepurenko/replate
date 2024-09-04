import type { FoodItem, Fridge } from "@prisma/client";
import Link from "next/link";
import { DeleteFridge } from "./DeleteFridge";

type Props = {
    Location?: {
        id: number;
        lat: number;
        lng: number;
    } | null;
} & {
    id: number;
    fridgeTitle: string;
    locationId: number | null;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    defaultLocation: string | null;
    foodItems: FoodItem[] | null;
} & { interact?: boolean };
export default function FridgeTeaser({
    Location,
    fridgeTitle,
    id,
    defaultLocation,
    foodItems,
    userId,
    interact = false,
}: Props) {
    return (
        <article className="product-teaser">
            <Link className="fridge__link" href={`/fridge/${id}`}>
                <h2>{fridgeTitle}</h2>

                {defaultLocation && (
                    <>
                        <strong>Ort: {defaultLocation}</strong>
                    </>
                )}
            </Link>
            {foodItems?.length && foodItems?.length > 0 ? (
                <ul>
                    {foodItems.map((foodItem) => (
                        <li key={foodItem.id}>
                            {foodItem.title} : {foodItem.quantity}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>
                    <small>(keine Produkte vorhanden)</small>
                </p>
            )}
            <DeleteFridge id={id} userId={userId} />
        </article>
    );
}
