// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppProps, AppType } from "next/app";
import { api } from "../utils/api";
import { ThemeProvider } from "@mui/material";
import { theme } from "../utils/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "../styles/globals.css";
import { Navbar } from "../components/navbar";
import { useRouter } from "next/router";
import { CenterLoader } from "../components/CenterLoader";
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  session: Session | null;
}

const clientSideEmotionCache = createEmotionCache();

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    session,
    pageProps,
  } = props;

  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <MyApp2 pageProps={pageProps} Component={Component} />
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
};

const MyApp2: React.FunctionComponent<
  Pick<AppProps, "Component" | "pageProps">
> = (props) => {
  const { Component, pageProps } = props;

  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return <CenterLoader />;
  }

  return <>{sessionData ? <Component {...pageProps} /> : <AuthShowcase />}</>;
};

const AuthShowcase: React.FC = () => {
  const router = useRouter();
  const { data: secretMessage } = api.auth.getSecretMessage.useQuery();

  const { data: sessionData } = useSession();

  // if (sessionData) {
  //   router.push("/skis");
  // }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
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
