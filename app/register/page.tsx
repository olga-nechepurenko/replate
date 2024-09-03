// import ProductTeaser from '@/components/ProductTeaser';
// import type { Product } from '@/types/shop-types';
// import type { Metadata } from 'next';

import { auth } from "@/auth";
import { SignIn } from "@/components/Auth/SignIn";
import RegistratingForm from "@/components/Registration/RegistratingForm";
import { userInDb } from "@/components/Registration/registrationServerActions";
import { IoCheckboxOutline } from "react-icons/io5";

// export const metadata: Metadata = {
//   title: 'Registrierung',
//   description: 'Willkommen zur rePlate Registrierung!',
// };

/* Server-Komponenten können asynchron sein */
export default async function RegistratingPage() {
    const session = await auth();
    //   const response = await fetch('https://fakestoreapi.com/products', {
    //     cache: 'force-cache',
    //   });

    // const products = (await response.json()) as Product[];

    const email = session?.user?.email ?? "";
    const user = await userInDb(email);
    console.log(user);

    return (
        <div>
            <h1>Willkommen zu rePlate!</h1>
            <p>um in 5 Minuten loszulegen, folge den Anweisungen:</p>
            <h3>1. SignIn mit deinem Konto:</h3>
            {session ? (
                <IoCheckboxOutline />
            ) : (
                <div>
                    <SignIn />
                </div>
            )}
            <h3>2. Lege dein Profil ein:</h3>
            {session && user ? <IoCheckboxOutline /> : <RegistratingForm />}
            <h3>3. Füge die Produkte hinzu:</h3>
            {session && user && <p>Add fridge form</p>}
        </div>
    );
}
