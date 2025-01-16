import React from "react";
import LongBtn from "../../components/buttons/LongBtn";
import ShortBtn from "../../components/buttons/ShortBtn";
import RadioBtn from "../../components/buttons/RadioBtn";
import NormalInput from "../../components/input/NormalInput";
import SearchInput from "../../components/input/SearchInput";

const Home: React.FC = () => {
  return (
    <div>
      <LongBtn />
      <ShortBtn />
      <RadioBtn />
      <NormalInput />
      <SearchInput />
    </div>
  );
};

export default Home;
