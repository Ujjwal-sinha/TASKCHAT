import React from 'react'
import { render } from "react-dom";
import LogIn from './components/LogIn/LogIn';
import Todo from './components/Todo/Todo';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  )
};

render(<App />, document.getElementById("app"));
