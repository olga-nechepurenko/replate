import type { Metadata } from "next";
import { capitalize } from "es-toolkit";
import { notFound } from "next/navigation";
import prisma from "@/prisma/db";
import FridgeTeaser from "@/components/FridgeTeaser";
import AddFridge from "@/components/AddFridge";
import MessageComponent from "@/components/MessageComponent";
import AddAnswerForm from "@/components/AddAnswerForm";

export const metadata: Metadata = {
    title: "Messages",
};

type Props = {
    params: {
        profileId: string;
    };
};
export default async function MessagesPage({ params: { profileId } }: Props) {
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
                    <h5>TODO: Archive component</h5>
                </div>
            )}
        </>
    );
}
