import React, { Fragment } from "react";
import Header from './../components/Header';
import Footer from "./../components/Footer";
import WorkerList from './../components/WorkerList';

function Prisoners() {
  return (
    <Fragment>
    <Header/>
    <WorkerList/>
    <Footer/>
    </Fragment>
  );
}

export default Prisoners;