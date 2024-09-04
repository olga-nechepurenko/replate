import Link from "next/link";

type Props = {
    Location: {
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
};
export default function FridgeTeaser({ Location, fridgeTitle, id }: Props) {
    return (
        <article className="product-teaser">
            <h2 className="product-teaser__title capitalize">
                <Link href={`/fridge/${id}`}>{fridgeTitle}</Link>
            </h2>
            <strong>Ort:</strong>
            {/* {foodItems.length > 0 && (
                    <>
                        <dt>Kategor{category.length > 1 ? "ien:" : "ie:"}</dt>
                        <dd>
                            {category
                                .map((category) => category.name)
                                .join(", ")}
                        </dd>
                    </>
                )} */}
        </article>
    );
}
