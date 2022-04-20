import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './components/App';
import CardExpanded from "./components/CardExpanded";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path="card/:title" element={<CardExpanded />}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);