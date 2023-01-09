import { NextPage } from "next";
import { CenterLoader } from "../../components/CenterLoader";

const Home: NextPage = () => {

  
    // if (sessionData) {
    //   router.push("/skis");
    // }
  
    return (
      <>
        <CenterLoader />
      </>
    );
  };
  
  export default Home;