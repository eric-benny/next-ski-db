import { SignIn } from "@clerk/nextjs";
import { Navbar } from "~/components/navbar";

const SignInPage = () => (
  <>
    <Navbar />
    <div className="flex justify-center">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  </>
);

export default SignInPage;
