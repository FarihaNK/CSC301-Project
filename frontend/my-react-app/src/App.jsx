import React from "react";
import AboutPage from "./pages/AboutPage"; // Ensure this path is correct
import LandingPage from "./pages/LandingPage"; // Ensure this path is correct
import NavBar from "./components/Navbar";
import UserJoin from "./pages/UserJoin";
import UserLogin from "./pages/UserLogin";
function App() {
    let component
    switch (window.location.pathname){
        case "/":
            component = <LandingPage/>
            break
        case "/home":
            component = <LandingPage/>
            break
        case "/about":
            component = <AboutPage/>
            break;
        case "/login":
            component = <UserLogin/>
            break;
        case "/getstarted":
            component = <UserJoin/>
            break;
    }
  return (
    <>
        <NavBar />
        {component}
    </>

  );
}

export default App;