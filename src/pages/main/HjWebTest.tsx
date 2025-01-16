import React from "react";
import LongBtn from "../../components/buttons/LongBtn";
import ShortBtn from "../../components/buttons/ShortBtn";
import RadioBtn from "../../components/buttons/RadioBtn";
import NormalInput from "../../components/input/NormalInput";
import SearchInput from "../../components/input/SearchInput";
import SideBar from "../../components/sideBar/SideBar";

const Home: React.FC = () => {
  return (
    <div>
      <LongBtn />
      <ShortBtn />
      <RadioBtn />
      <NormalInput />
      <SearchInput />
      <SideBar />
    </div>
  );
};

export default Home;
