import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SignIn from './../Components/SignIn/sign-in.tsx';
import homeImage from "./../img/homepage.png"
import "../home.css"
import Navbar from '../Components/Navbar/navbar';
import Typewriter from '../Components/Typewriter';

const Root = () => {
  const [user, setUser] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
     
      <div className={"home"}>
      <img src={homeImage} style={{width:"55%", height:"75%", marginLeft:"10px"}} alt={""}></img>
      <div style={{marginLeft:"20px",marginTop:"40px", display:"flex", width:"600px", justifyContent:"flex-start", flexDirection:"column", alignItems:"flex-end"}}>
        <h1 style={{}}>Ogni parcheggio</h1>
        <Typewriter text="nella tua tasca" delay={100}/>
        <div style={{display:"flex", justifyContent:"flex-end", marginTop:"100px", marginRight:"90px"}}>
      <button style={{backgroundColor:"#e96d20", color:"#13171f"}}> Cerca un parcheggio</button>
      </div>
      </div>
       
      </div>
      
    </>
  );
};




export default Root;
