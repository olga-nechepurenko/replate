import type { FoodItem, Message, User } from "@prisma/client";

type Props = {
    sender?: User | null;
} & {
    receiver?: User | null;
} & { foodItem: FoodItem | null } & Message;

export default function MessageComponent({
    id,
    content,
    foodItem,
    sender,
    receiver,
    sentAt,
}: Props) {
    const expired = foodItem!.expirationDate < new Date();
    return (
        <>
            <div>
                <p>von: {sender?.username}</p>
                <time dateTime={sentAt.toDateString().substring(0, 10)}>
                    {sentAt.toLocaleDateString("de")}
                </time>
            </div>
            <div>
                <p>{foodItem?.title}</p>
                {expired ? (
                    <>Abgelaufen</>
                ) : (
                    <>
                        gut bis: :
                        <time
                            dateTime={foodItem!.expirationDate
                                .toDateString()
                                .substring(0, 10)}
                        >
                            {foodItem!.expirationDate.toLocaleDateString("de")}
                        </time>
                    </>
                )}
            </div>
            <div>{content}</div>
        </>
    );
}
