"use client";

type Props = {
    error: Error;
    reset: () => void;
};
export default function ErrorPage({ error, reset }: Props) {
    return (
        <main className="default-layout">
            <h1>Es gab leider ein Problem</h1>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Nochmal versuchen</button>
        </main>
    );
}
