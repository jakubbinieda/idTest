import React, { Fragment } from "react";
import Header from '../components/Header';
import Footer from "../components/Footer";
import WorkerProfilePage from '../components/WorkerProfilePage';

function Prisoners() {
  return (
    <Fragment>
    <Header/>
    <WorkerProfilePage/>
    <Footer/>
    </Fragment>
  );
}

export default Prisoners;