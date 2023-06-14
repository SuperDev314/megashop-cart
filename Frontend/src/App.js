import React, { useEffect } from "react";
import {BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import ShareCart from "./components/share_cart.js";

const App = () => {

  useEffect(() =>{
    console.log("Hey, App Component is here.....")
  }, [])

  return (
    
    <Router>
      <Routes>
        <Route path={`/cart/:id`} element={<ShareCart />} />
      </Routes>
    </Router>
      
  )
};

export default App;
