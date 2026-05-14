import React from "react";

import { useSelector } from "react-redux";

import DoctorChat from "./DoctorChat";
import PatientChat from "./PatientChat";

const Chat = () => {

  const { currentUser } =
    useSelector((state) => state.user);

  console.log(currentUser);

  if (currentUser?.role === "doctor") {
    return <DoctorChat />;
  }

  return <PatientChat />;
};

export default Chat;