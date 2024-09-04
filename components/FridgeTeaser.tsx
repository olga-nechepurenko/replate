import type { FoodItem, Fridge } from "@prisma/client";
import Link from "next/link";

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
    interact = false,
}: Props) {
    return (
        <article className="product-teaser">
            <h2>
                <Link href={`/fridge/${id}`}>{fridgeTitle}</Link>
            </h2>
            {defaultLocation && (
                <>
                    <strong>Ort: {defaultLocation}</strong>
                </>
            )}

            {foodItems?.length && foodItems?.length > 0 && (
                <ul>
                    {foodItems.map((foodItem) => (
                        <li key={foodItem.id}>
                            {foodItem.title} : {foodItem.quantity}
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
}
