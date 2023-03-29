import { SignIn } from "@clerk/nextjs";
import { Navbar } from "~/components/navbar";

const SignInPage = () => (
  <>
    <Navbar />
    <div className="flex justify-center">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
          variables: {
            colorPrimary: "#DB252E",
            colorText: "black",
            fontFamily: "Roboto",
          },
        }}
      />
    </div>
  </>
);

export default SignInPage;
