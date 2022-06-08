import React, { Fragment } from "react";
import Header from '../components/Header';
import Footer from "../components/Footer";
import PrisonerCreatorPage from '../components/PrisonerCreatorPage';

function PrisonersCreator() {
  return (
    <Fragment>
    <Header/>
    <PrisonerCreatorPage/>
    <Footer/>
    </Fragment>
  );
}

export default PrisonersCreator;