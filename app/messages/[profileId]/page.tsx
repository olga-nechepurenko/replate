import type { Metadata } from "next";
import { redirect } from "next/navigation";
import prisma from "@/prisma/db";
import MessageComponent from "@/components/MessageComponent";
import AddAnswerForm from "@/components/AddAnswerForm";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "meine Messages",
};
type Props = {
    params: {
        profileId: string;
    };
};
export default async function MessagesPage({ params: { profileId } }: Props) {
    const session = await auth();
    if (!session) {
        redirect("/");
    }
    const messages = await prisma.message.findMany({
        where: {
            receiverId: Number(profileId),
            read: false,
        },
        include: {
            sender: true,
            foodItem: true,
            receiver: true,
        },
    });

    return (
        <>
            <h3>neue Nachrichten:</h3>
            {messages.length && messages.length > 0 ? (
                <div>
                    {messages.map((message) => (
                        <article key={message.id} className="message-in-list">
                            <MessageComponent key={message.id} {...message} />
                            <AddAnswerForm
                                key={message.id}
                                foodItemId={message.foodItemId!}
                                senderId={message.senderId}
                                recieverId={message.receiverId}
                                messageId={message.id}
                            />
                        </article>
                    ))}
                </div>
            ) : (
                <div>
                    <p>keine neue Nachrichten</p>
                </div>
            )}
            <h5>Feature in V.2: Archive component</h5>
        </>
    );
}
