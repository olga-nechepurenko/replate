export type GitHubUser = {
    name: string;
    email: string;
    image?: string;
};

declare module "next-auth" {
    /**
     * Returned by `useSession`, `auth`, contains information about the active session.
     */
    interface Session {
        user: GitHubUser;
    }
}
