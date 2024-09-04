// import ProductTeaser from '@/components/ProductTeaser';
// import type { Product } from '@/types/shop-types';
// import type { Metadata } from 'next';

import { auth } from "@/auth";
import { SignIn } from "@/components/Auth/SignIn";
import AddFridge from "@/components/Registration/AddFridge";
import RegistratingForm from "@/components/Registration/RegistratingForm";
import { userInDb } from "@/components/Registration/registrationServerActions";
import prisma from "@/prisma/db";
import { useState } from "react";
import { IoCheckboxOutline } from "react-icons/io5";

const session = await auth();

// export const metadata: Metadata = {
//   title: 'Registrierung',
//   description: 'Willkommen zur rePlate Registrierung!',
// };

/* Server-Komponenten können asynchron sein */
export default async function RegistratingPage() {
    //   const response = await fetch('https://fakestoreapi.com/products', {
    //     cache: 'force-cache',
    //   });

    // const products = (await response.json()) as Product[];

    const email = session?.user?.email ?? "";
    const user = await userInDb(email);
    // const user = await prisma.user.findUnique({
    //     where: {
    //         email,
    //     },
    // });
    // console.log("user:", user);

    //const [valueFromChild, setValueFromChild] = useState(false);
    //let valueFromChild = false;

    return (
        <div>
            <h1>Willkommen zu rePlate!</h1>
            <p>um in 5 Minuten loszulegen, folge den Anweisungen:</p>
            <h3>1. SignIn mit deinem Konto:</h3>
            {session ? (
                <>
                    <IoCheckboxOutline />
                    <p> Angemeldet als {session.user.name}</p>
                </>
            ) : (
                <div>
                    <SignIn />
                </div>
            )}
            <h3>2. Lege dein Profil ein:</h3>
            <RegistratingForm email={email} user={user} />
            {session && <AddFridge email={email} />}

            {/* {user !== null ? (
                        <>
                            <IoCheckboxOutline />
                            <h3>3. Füge die Produkte hinzu:</h3>
                        </>
                    ) : (
                        <RegistratingForm email={email} />
                    )} */}
        </div>
    );
}
