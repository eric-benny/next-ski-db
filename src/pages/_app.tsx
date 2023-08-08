// src/pages/_app.tsx
import "../styles/globals.css";
import { type AppType } from "next/app";
import { api } from "../utils/api";
import { ThemeProvider } from "@mui/material";
import { theme } from "../utils/theme";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "../styles/globals.css";
import { Navbar } from "../components/navbar";
import { useRouter } from "next/router";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

const publicPages: Array<string> = [
  "/sign-in/[[...index]]",
  "/sign-up/[[...index]]",
  "/skis",
];

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider theme={theme}>
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <>
          <Component {...pageProps} />
            {/* <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <Navbar />
              <div className="">
                <div className="flex justify-center">
                  <h1>Sign in to Access</h1>
                </div>
                <div className="flex justify-center">
                  <SignInButton>
                    <button className="h-10 items-center justify-center rounded-md border-0 bg-gray-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-gray-400 transition-colors hover:cursor-pointer  hover:bg-red-600 hover:text-white hover:shadow-md">
                      Sign in
                    </button>
                  </SignInButton>
                </div>
              </div>
              <RedirectToSignIn />
            </SignedOut> */}
          </>
        )}
      </ThemeProvider>
    </ClerkProvider>
  );
};

// export async function getServerSideProps({ req, res }: {req: any, res: any}) {
//   return {
//     props: {
//       session: await unstable_getServerSession(req, res, authOptions)
//     }
//   }
// }

// const MyApp: AppType<{ session: Session | null }> = ({
//   Component,
//   pageProps: { session, ...pageProps },
// }) => {
//   return (
//     <SessionProvider session={session}>
//       <CacheProvider value={clientSideEmotionCache}>
//         <ThemeProvider theme={theme}>
//           <Component {...pageProps} />
//         </ThemeProvider>
//       </CacheProvider>
//     </SessionProvider>
//   );
// };

export default api.withTRPC(MyApp);
