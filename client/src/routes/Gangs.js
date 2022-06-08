import React, { Fragment } from "react";
import Header from './../components/Header';
import Footer from "./../components/Footer";
import GangList from './../components/GangList';

function Gangs() {
  return (
    <Fragment>
    <Header/>
    <GangList/>
    <Footer/>
    </Fragment>
  );
}

export default Gangs;