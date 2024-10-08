import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SetAvatar = lazy(() => import("./pages/SetAvatar"));
const SetUsername = lazy(() => import("./pages/SetUsername"));

const App = () => {
   return (
      <BrowserRouter>
         <Suspense fallback={<></>}>
            <Routes>
               <Route path="/register" element={<Register />} />
               <Route path="/login" element={<Login />} />
               <Route path="/" element={<Chat />} />
               <Route path="/setAvatar" element={<SetAvatar />} />
               <Route path="/setusername" element={<SetUsername />} />
            </Routes>
         </Suspense>
      </BrowserRouter>
   );
};

export default App;
