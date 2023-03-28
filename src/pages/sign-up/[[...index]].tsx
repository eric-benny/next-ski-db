import { SignUp } from "@clerk/nextjs";
import { Navbar } from "~/components/navbar";

const SignUpPage = () => (
  <>
    <Navbar />
    <div className="flex justify-center">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  </>
);
export default SignUpPage;
