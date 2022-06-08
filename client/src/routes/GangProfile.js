import React, { Fragment } from "react";
import Header from '../components/Header';
import Footer from "../components/Footer";
import GangProfilePage from '../components/GangProfilePage';

function GangProfile() {
  return (
    <Fragment>
    <Header/>
    <GangProfilePage/>
    <Footer/>
    </Fragment>
  );
}

export default GangProfile;