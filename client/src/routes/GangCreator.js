import React, { Fragment } from "react";
import Header from '../components/Header';
import Footer from "../components/Footer";
import GangCreatorPage from '../components/GangCreatorPage';

function GangCreator() {
  return (
    <Fragment>
    <Header/>
    <GangCreatorPage/>
    <Footer/>
    </Fragment>
  );
}

export default GangCreator;