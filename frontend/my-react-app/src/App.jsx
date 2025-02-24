// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
// import Upload from "./pages/upload";
// function App()
// {
//     return <Upload />;
// }
// export default App;

// import React from 'react';
// import DocumentUpload from './components/DocumentUpload';

// function App() {
//   return (
//     <div>
//       <h1>My Project</h1>
//       <DocumentUpload />
//     </div>
//   );
// }

// export default App;




import React from 'react';
import { BrowserRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import Documents from './pages/upload'
import ChatboxInterface from './pages/ChatbotInterface'; // Your main page component

const App = () => {
    return (
        <BrowserRouter> {/* Wrap everything with Router */}
            <Routes> {/* Use Routes to define your routes */}
            {/* Default Route */}
            <Route path="/" element={<Documents />} /> {}
            <Route path="/medassist" element={<ChatboxInterface />} /> {}
            <Route path="/docUpload" element={<Documents />} /> {}
            </Routes>
        </BrowserRouter>
    );
  };
  
  export default App;

