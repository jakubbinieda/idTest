import React, { Fragment } from "react";
import Header from './../components/Header';
import Footer from "./../components/Footer";
import PrisonerList from './../components/PrisonerList';

function Prisoners() {
  return (
    <Fragment>
    <Header/>
    <PrisonerList/>
    <Footer/>
    </Fragment>
  );
}

export default Prisoners;