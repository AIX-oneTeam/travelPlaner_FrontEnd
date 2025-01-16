import React from "react";
import LongBtn from "../../components/buttons/LongBtn";
import ShortBtn from "../../components/buttons/ShortBtn";
import RadioBtn from "../../components/buttons/RadioBtn";

const Home: React.FC = () => {
  return (
    <div>
      <LongBtn />
      <ShortBtn />
      <RadioBtn />
    </div>
  );
};

export default Home;
