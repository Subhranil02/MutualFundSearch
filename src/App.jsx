import { useState } from "react";
import Navbar from "./components/Navbar";
import SavedFund from "./components/SavedFund";
import Alert from "./components/Alert";
import { Router, Route, Routes } from "react-router-dom";
import SearchFunds from "./components/SearchFunds";
import FundDetails from "./components/FundDetails";
import PrivateRoute from "./components/PrivateRoute";
// import NoteState from "./context/notes/NoteState";
import LoadingBar from "react-top-loading-bar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    // <NoteState></NoteState>
    <div>
      <Navbar />
      <LoadingBar height={3} color="#f11946" />
      <Alert alert={alert} />
      <div className="container">
        <Routes>
          <Route path="/" element={<SearchFunds />} />
          <Route
            path="/mf/:id"
            element={
              <PrivateRoute>
                <FundDetails showAlert={showAlert} />
              </PrivateRoute>
            }
          />

          <Route
            path="/savedfund"
            element={
              <PrivateRoute>
                <SavedFundPage showAlert={showAlert} />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<Login showAlert={showAlert} />} />
          <Route path="/signup" element={<SignUp showAlert={showAlert} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
