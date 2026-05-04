import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './utils/Themes';
import Authentication from './pages/Authentication';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Symptomcheck from './pages/Symptomcheck';
import Labreport from './pages/Labreport';
import Chat from './pages/Chat';
import Finddoctor from './pages/Finddoctor';
import Dietplan from './pages/Dietplan';
import Profile from './pages/Profile';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <ThemeProvider theme={lightTheme}>
            <BrowserRouter>
                {currentUser ? (
                    <div className="flex flex-col w-full h-screen bg-gray-100 text-gray-900 overflow-hidden">
                        <Navbar currentUser={currentUser} />
                        <div className="flex-grow overflow-y-auto">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/Symptomcheck" element={<Symptomcheck />} />
                                <Route path="/Labreport" element={<Labreport />} />
                                <Route path="/chat" element={<Chat />} />
                                <Route path="/Finddoctor" element={<Finddoctor />} />
                                <Route path="/Dietplan" element={<Dietplan />} />
                                <Route path="/profile" element={<Profile />} />
                                {/* Protected Admin Route */}
                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute adminOnly={true}>
                                            <Admin />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col w-full h-screen bg-gray-100 text-gray-900 overflow-hidden">
                        <Authentication />
                    </div>
                )}
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
