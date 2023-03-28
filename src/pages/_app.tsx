// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { api } from "../utils/api";
import { ThemeProvider } from "@mui/material";
import { theme } from "../utils/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";

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
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const publicPages: Array<string> = [
  "/sign-in/[[...index]]",
  "/sign-up/[[...index]]",
];

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <Navbar />
          {isPublicPage ? (
            <Component {...pageProps} />
          ) : (
            <>
              <SignedIn>
                <Component {...pageProps} />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          )}
        </ThemeProvider>
      </CacheProvider>
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
