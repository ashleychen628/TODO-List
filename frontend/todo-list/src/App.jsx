import React, {useState} from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ToDoPage from "./pages/ToDoPage";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import Layout from "./components/Layout";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLoginDialog = () => setIsLoginOpen(true);
  const closeLoginDialog = () => setIsLoginOpen(false);

  return (
    <Layout>
      <Navbar openLogin={isLoginOpen} handleOpenLogin={openLoginDialog} handleCloseLogin={closeLoginDialog} />
      <Routes>
        <Route path="/" element={<ToDoPage />} />
        <Route
          path="/register"
          element={<Register triggerLogin={openLoginDialog} />}
        />
        <Route path="/LogIn" element={<LogIn />} />
      </Routes>
      <LogIn open={isLoginOpen} handleClose={closeLoginDialog} />
    </Layout>
  );
}

export default App;
