import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export function SignOut() {
    return (
        <form
            action={async () => {
                "use server";
                await signOut();
                redirect("/");
            }}
        >
            <button type="submit">Abmelden</button>
        </form>
    );
}
