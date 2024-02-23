import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Elevator } from './design/Elevator/Elevator';
import { ElevatorLobby } from './design/Elevator/ElevatorLobby';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/designs/elevator' element={<ElevatorLobby />}/>
            <Route path='*' element={<div>Page Not Found</div>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
