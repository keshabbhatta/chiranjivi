import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  // Access the user data from the Redux store
  const { currentUser, isLoading, error } = useSelector((state) => state.user);

  if (isLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!currentUser) {
    return <div className="text-center">No user found</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
        <img
          src={currentUser.userImage}
          alt={`${currentUser.fullname}'s profile`}
          className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300"
        />
        <h2 className="text-xl font-semibold">{currentUser.fullname}</h2>
        <p className="text-gray-700">Email: {currentUser.email}</p>
        <p className="text-gray-700">
          Admin Status: {currentUser.isAdmin ? "Admin" : "User"}
        </p>
      </div>
    </div>
  );
};

export default Profile;