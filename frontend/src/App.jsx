import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { generateToken, messaging } from './notifications/firebase';
import { onMessage } from 'firebase/messaging';
import './App.css';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentHomePage from './pages/StudentHomePage';
import HalfDayLeaveForm from './pages/HalfDayLeaveForm';
import FullDayLeaveForm from './pages/FullDayLeaveForm';

function AppContent() {

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  }, []);
  
  const [rollNumber, setRollNumber] = useState("");
  
    useEffect(() => {
        const storedRollNumber = sessionStorage.getItem("storedRollNumber");
        if(storedRollNumber)
                setRollNumber(storedRollNumber);
    }, []);
  
    const updateRollNumber = ((rollNumber) => {
        setRollNumber(rollNumber);
        sessionStorage.setItem("storedRollNumber", rollNumber);
    })
  
  return (
  <div>
    <Routes>
        <Route path="/" element={<StudentLoginPage updateRollNumber={updateRollNumber} />} />
        <Route path="/home" element={<StudentHomePage rollNumber={rollNumber}/>} />
        <Route path="/half-day-leave" element={<HalfDayLeaveForm rollNumber={rollNumber}/>} />
        <Route path="/full-day-leave" element={<FullDayLeaveForm rollNumber={rollNumber}/>} />
    </Routes>
  </div>
  );
}

function App() {
  return (
    <Router>
        <AppContent />
    </Router>
);
}

export default App;
