import { SignUp } from "@clerk/nextjs";
import { Navbar } from "~/components/navbar";

const SignUpPage = () => (
  <>
    <Navbar />
    <div className="flex justify-center">
      Sign up not available
      {/* <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#DB252E",
            colorText: "black",
            fontFamily: "Roboto",
          },
        }}
      /> */}
    </div>
  </>
);
export default SignUpPage;
