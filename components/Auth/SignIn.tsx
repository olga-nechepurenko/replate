import { signIn } from '@/auth';
import { FaGithub } from 'react-icons/fa';

export function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn();
      }}
    >
      <button type="submit">
        Anmelden mit GitHub <FaGithub />
      </button>
    </form>
  );
}
