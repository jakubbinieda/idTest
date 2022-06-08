import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Prisoners from './routes/Prisoners';
import Workers from './routes/Workers';
import Gangs from './routes/Gangs';
import Description from './routes/Description';
import PrisonerProfile from './routes/PrisonerProfile';
import WorkerProfile from './routes/WorkerProfile';
import PrisonerCreator from './routes/PrisonerCreator';
import WorkerCreator from './routes/WorkerCreator';
import Advanced from './routes/Advanced';
import GangCreator from './routes/GangCreator';
import GangProfile from './routes/GangProfile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}/>
        <Route path="/wiezniowie" element={<Prisoners/>}/>
        <Route path="/pracownicy" element={<Workers/>}/>
        <Route path="/gangi" element={<Gangs/>}/>
        <Route path="/opis" element={<Description/>}/>
        <Route path="/profilWieznia:id" element={<PrisonerProfile/>}/>
        <Route path="/profilPracownika:id" element={<WorkerProfile/>}/>
        <Route path="/profilGangu:id" element={<GangProfile/>}/>
        <Route path="/kreatorWiezniow" element={<PrisonerCreator/>}/>
        <Route path="/kreatorPracownikow" element={<WorkerCreator/>}/>
        <Route path="/kreatorGangow" element={<GangCreator/>}/>
        <Route path="/zaawansowane" element={<Advanced/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);