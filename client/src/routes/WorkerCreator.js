import React, { Fragment } from "react";
import Header from '../components/Header';
import Footer from "../components/Footer";
import WorkerCreatorPage from '../components/WorkerCreatorPage';

function WorkersCreator() {
  return (
    <Fragment>
    <Header/>
    <WorkerCreatorPage/>
    <Footer/>
    </Fragment>
  );
}

export default WorkersCreator;