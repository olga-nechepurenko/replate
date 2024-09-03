import type { GitHubUser } from "@/types/auth-types";
import Image from "next/image";

type Props = GitHubUser;
export default function User({ name, image }: Props) {
    return (
        <div className="user">
            {name}
            {image && (
                <Image
                    src={image}
                    alt={`GitHub-Avatar von ${name}`}
                    width={64}
                    height={64}
                />
            )}
        </div>
    );
}
