import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkUsernameRoute, registerRoute } from "../utils/APIRoutes";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebaseConfig";
import { debounce } from "../utils/Debounce";

const SetUsername = () => {
   onAuthStateChanged(firebaseAuth, (userData) => {
      if (!userData) {
         navigate("/login");
      } else {
         setEmail(
            userData.email ? userData.email : userData.providerData[0].email
         );
      }
   });
   const navigate = useNavigate();

   const [values, setValues] = useState("");
   const [label, setLabel] = useState("");
   const [email, setEmail] = useState(undefined);
   const [usernameStatus, setUsernameStatus] = useState(undefined);

   const toastOptions = {
      position: "top-center",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
   };

   useEffect(() => {
      if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
         navigate("/");
      }
   }, [navigate]);

   const handleChange = debounce((name) => checkUsername(name), 500);

   const handleSubmit = async (event) => {
      event.preventDefault();
      if (handleValidation()) {
         const { data } = await axios.post(registerRoute, {
            username: values,
            email,
            password: (Math.random() + 1).toString(20).substring(1),
         });
         if (data.status === false) {
            toast.error(data.msg, toastOptions);
         }
         if (data.status === true) {
            localStorage.setItem(
               process.env.REACT_APP_LOCALHOST_KEY,
               JSON.stringify(data.user)
            );
            navigate("/");
         }
      }
   };

   const handleValidation = () => {
      if (values.length < 3) {
         toast.error("Username is required", toastOptions);
         return false;
      }
      return true;
   };

   const checkUsername = async (username) => {
      if (username.length > 3) {
         const { data } = await axios.post(checkUsernameRoute, { username });
         setUsernameStatus(data.status);
         setLabel(data.msg);
         setValues(username);
      }
   };

   return (
      <>
         <FormContainer>
            {email && (
               <form onSubmit={(event) => handleSubmit(event)}>
                  <span>Check Username Availability</span>
                  <div className="row">
                     <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={(e) => handleChange(e.target.value)}
                        autoComplete="off"
                        min="3"
                        className={`${
                           usernameStatus
                              ? "success"
                              : usernameStatus !== undefined
                              ? "danger"
                              : ""
                        }`}
                     />
                     <label
                        htmlFor=""
                        className={`${
                           usernameStatus
                              ? "success"
                              : usernameStatus !== undefined
                              ? "danger"
                              : ""
                        }`}
                     >
                        {label}
                     </label>
                  </div>

                  <button type="submit" className="btn">
                     Create User
                  </button>
               </form>
            )}
         </FormContainer>
         <ToastContainer />
      </>
   );
};

const FormContainer = styled.div`
   height: 100vh;
   width: 100vw;
   display: flex;
   flex-direction: column;
   justify-content: center;
   gap: 1rem;
   align-items: center;
   background-color: #131324;
   .row {
      label {
         display: block;
         margin: 10px 0 0 5px;
         transition: 0.3s ease-in-out;
         height: 0.5rem;
      }
      label.success {
         color: #39ff14;
      }
      label.danger {
         color: #ff3131;
      }
   }
   form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      background-color: #00000076;
      border-radius: 2rem;
      padding: 3rem 5rem;
      input {
         background-color: transparent;
         padding: 1rem;
         border: 0.1rem solid #4e0eff;
         border-radius: 0.4rem;
         color: white;
         width: 100%;
         font-size: 1rem;
         &:focus {
            border: 0.1rem solid #997af0;
            outline: none;
         }
      }
      .success {
         border-color: #39ff14;
         &:focus {
            border-color: #39ff14;
         }
      }
      .danger {
         border-color: #ff3131;
         &:focus {
            border-color: #ff3131;
         }
      }
      .btn {
         background-color: #997af0;
         color: white;
         padding: 1rem 2rem;
         border: none;
         font-weight: bold;
         cursor: pointer;
         border-radius: 0.4rem;
         font-size: 1rem;
         text-transform: uppercase;
         transition: 0.5s ease-in-out;
      }
      span {
         color: white;
         text-transform: uppercase;
      }
   }
`;

export default SetUsername;
