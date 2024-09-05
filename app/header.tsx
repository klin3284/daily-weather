import {
  SignInButton, SignedIn, SignedOut, UserButton,
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const header = () => (
  <header
    style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}
  >
    <h1>My App</h1>
    <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <UserButton
        userProfileMode="modal"
        appearance={{
          baseTheme: dark,
        }}
      />
    </SignedIn>
  </header>
);

export default header;
