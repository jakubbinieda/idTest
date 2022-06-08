import React, { Fragment } from "react";
import Header from '../components/Header';
import Footer from "../components/Footer";
import PrisonerProfilePage from '../components/PrisonerProfilePage';

function Prisoners() {
  return (
    <Fragment>
    <Header/>
    <PrisonerProfilePage/>
    <Footer/>
    </Fragment>
  );
}

export default Prisoners;