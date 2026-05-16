import React, { useState } from "react";
import {
  SearchIcon,
  LocationMarkerIcon,
} from "@heroicons/react/solid";

const SearchBar = () => {
  const hospitals = [
    {
      name: "Busan National University Hospital",
      location: "Seo-gu, Busan",
    },
    {
      name: "Dong-A University Hospital",
      location: "Seo-gu, Busan",
    },
    {
      name: "Inje University Busan Paik Hospital",
      location: "Busanjin-gu, Busan",
    },
    {
      name: "Kosin University Gospel Hospital",
      location: "Seo-gu, Busan",
    },
    {
      name: "Good Gang-An Hospital",
      location: "Suyeong-gu, Busan",
    },
    {
      name: "Busan St. Mary's Hospital",
      location: "Nam-gu, Busan",
    },
    {
      name: "Haeundae Paik Hospital",
      location: "Haeundae-gu, Busan",
    },
    {
      name: "Medi Hospital",
      location: "Dongnae-gu, Busan",
    },
  ];

  const doctors = [
    {
      name: "Dr. Kim Min Soo",
      hospital: "Busan National University Hospital",
    },
    {
      name: "Dr. Park Ji Eun",
      hospital: "Dong-A University Hospital",
    },
    {
      name: "Dr. Lee Hyun Woo",
      hospital: "Inje University Busan Paik Hospital",
    },
    {
      name: "Dr. Choi Seo Jun",
      hospital: "Kosin University Gospel Hospital",
    },
    {
      name: "Dr. Jung Hye Jin",
      hospital: "Good Gang-An Hospital",
    },
    {
      name: "Dr. Han Ji Woo",
      hospital: "Busan St. Mary's Hospital",
    },
    {
      name: "Dr. Yoo Min Ho",
      hospital: "Haeundae Paik Hospital",
    },
    {
      name: "Dr. Shin Ara",
      hospital: "Medi Hospital",
    },
  ];

  const providerLinks = [
    {
      icon: "🚑",
      title: "Emergency Ambulance",
      description: "Fast emergency ambulance support",
    },
    {
      icon: "🩸",
      title: "Blood Support",
      description: "Find blood donors nearby",
    },
    {
      icon: "🏥",
      title: "Nearby Hospitals",
      description: "Search nearest hospitals",
    },
    {
      icon: "💊",
      title: "Emergency Pharmacy",
      description: "24/7 pharmacy support",
    },
  ];

  const emergencyTypes = [
    "🚑 Ambulance",
    "🩸 Blood Needed",
    "❤️ Heart Problem",
    "🦴 Accident/Injury",
    "🤒 Fever/Sickness",
    "🧠 Mental Emergency",
  ];

  const emergencyLevels = [
    "Low",
    "Medium",
    "Critical",
  ];

  const [doctorName, setDoctorName] = useState("");
  const [filteredResult, setFilteredResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const [emergencyType, setEmergencyType] = useState("");
  const [emergencyLevel, setEmergencyLevel] = useState("");

  const [currentLocation, setCurrentLocation] = useState(
    "Detecting location..."
  );

  // Search nearest hospital
  const handleSearch = () => {
    setSearched(true);

    let filteredHospital = hospitals[0];

    if (doctorName) {
      filteredHospital = hospitals.find((hospital) =>
        hospital.name
          .toLowerCase()
          .includes(doctorName.toLowerCase())
      );
    }

    if (!filteredHospital) {
      filteredHospital = hospitals[0];
    }

    const matchedDoctor = doctors.find(
      (doc) => doc.hospital === filteredHospital.name
    );

    setFilteredResult({
      hospital: filteredHospital,
      doctor: matchedDoctor,
    });
  };

  // Detect Current Location
  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCurrentLocation(
          `Latitude: ${lat.toFixed(
            4
          )}, Longitude: ${lng.toFixed(4)}`
        );

        // Automatically show nearest hospital
        setFilteredResult({
          hospital: hospitals[0],
          doctor: doctors[0],
        });

        setSearched(true);
      },
      () => {
        alert("Location access denied");
      }
    );
  };

  // Kakao Map
  const openKakaoMap = () => {
    window.open(
      "https://map.kakao.com/link/search/hospital",
      "_blank"
    );
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center px-4">

      {/* Header */}
      <header className="py-6 w-full flex justify-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-cyan-400 animate-pulse">
          BUSAN EMERGENCY HEALTHCARE
        </h1>
      </header>

      {/* Hero Section */}
      <div className="text-center mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
          Emergency Medical Assistance
        </h1>

        <p className="mt-5 text-lg text-gray-300 animate-bounce">
          Find nearby hospitals, ambulance & emergency support 🇰🇷
        </p>

      </div>

      {/* Search Section */}
      <div className="mt-12 bg-zinc-900/70 backdrop-blur-lg border border-gray-800 p-8 rounded-3xl shadow-2xl flex flex-col gap-5 items-center w-full max-w-5xl">

        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">

          <div className="relative">
            <input
              type="text"
              placeholder="Search doctor or hospital"
              value={doctorName}
              onChange={(e) =>
                setDoctorName(e.target.value)
              }
              className="w-80 px-12 py-4 rounded-xl bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />

            <SearchIcon className="h-5 w-5 text-cyan-400 absolute left-4 top-5" />
          </div>

          {/* Current Location Box */}
          <div className="relative">
            <input
              type="text"
              value={currentLocation}
              readOnly
              className="w-80 px-12 py-4 rounded-xl bg-black border border-gray-700 text-white"
            />

            <LocationMarkerIcon className="h-5 w-5 text-pink-400 absolute left-4 top-5" />
          </div>
        </div>

        {/* Emergency Dropdowns */}
        <div className="flex flex-col md:flex-row gap-4">

          {/* Emergency Type */}
          <select
            value={emergencyType}
            onChange={(e) =>
              setEmergencyType(e.target.value)
            }
            className="bg-black border border-gray-700 text-white px-6 py-4 rounded-xl"
          >
            <option value="">
              Select Emergency Type
            </option>

            {emergencyTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Emergency Level */}
          <select
            value={emergencyLevel}
            onChange={(e) =>
              setEmergencyLevel(e.target.value)
            }
            className="bg-black border border-gray-700 text-white px-6 py-4 rounded-xl"
          >
            <option value="">
              Emergency Level
            </option>

            {emergencyLevels.map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">

          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            SEARCH
          </button>

          <button
            onClick={openKakaoMap}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            OPEN KAKAO MAP
          </button>

          <button
            onClick={detectLocation}
            className="bg-red-600 px-8 py-4 rounded-xl font-bold hover:bg-red-700 hover:scale-105 transition"
          >
            USE CURRENT LOCATION
          </button>
        </div>
      </div>

      {/* Search Result */}
      {searched && filteredResult && (
        <div className="mt-12 bg-zinc-900 border border-gray-800 w-full max-w-3xl rounded-3xl p-10 text-center shadow-2xl">

          <h2 className="text-4xl font-bold text-cyan-400">
            Nearest Hospital Found
          </h2>

          <p className="mt-6 text-2xl text-white font-semibold">
            {filteredResult.hospital.name}
          </p>

          <p className="mt-3 text-gray-400 text-lg">
            {filteredResult.hospital.location}
          </p>

          {filteredResult.doctor && (
            <p className="mt-5 text-xl text-pink-400 font-bold">
              Doctor: {filteredResult.doctor.name}
            </p>
          )}

          {/* Emergency Info inside same box */}
          {emergencyType && (
            <div className="mt-8 border border-red-500 bg-red-950 rounded-2xl p-6">

              <h2 className="text-2xl font-bold text-red-400">
                Emergency Support Activated 🚨
              </h2>

              <p className="mt-4 text-lg text-white">
                Emergency Type: {emergencyType}
              </p>

              <p className="mt-2 text-lg text-white">
                Emergency Level: {emergencyLevel}
              </p>

              <a
  href="tel:01042129542"
  className="mt-6 inline-block bg-red-600 px-8 py-4 rounded-xl font-bold hover:bg-red-700 hover:scale-105 transition"
>
  CALL AMBULANCE 🚑
</a>
            </div>
          )}
        </div>
      )}

      {/* Emergency Numbers */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">

        <div className="bg-red-900 p-8 rounded-3xl text-center shadow-xl">
          <h1 className="text-5xl font-bold">119</h1>

          <p className="mt-3 text-lg">
            Ambulance & Fire Emergency
          </p>
        </div>

        <div className="bg-blue-900 p-8 rounded-3xl text-center shadow-xl">
          <h1 className="text-5xl font-bold">112</h1>

          <p className="mt-3 text-lg">
            Police Emergency
          </p>
        </div>

        <div className="bg-pink-900 p-8 rounded-3xl text-center shadow-xl">
          <h1 className="text-5xl font-bold">1339</h1>

          <p className="mt-3 text-lg">
            Medical Emergency Hotline
          </p>
        </div>
      </div>

      {/* Provider Section */}
      <div className="mt-20 w-full py-12 flex flex-wrap justify-center gap-6">

        {providerLinks.map((link, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-gray-800 hover:border-cyan-400 transition duration-300 rounded-3xl p-8 w-full md:w-64 flex flex-col items-center shadow-xl hover:scale-105"
          >
            <div className="text-6xl animate-bounce">
              {link.icon}
            </div>

            <h3 className="mt-5 text-xl font-bold text-white text-center">
              {link.title}
            </h3>

            <p className="mt-3 text-gray-400 text-center">
              {link.description}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 mb-10 text-gray-600 text-center">
        © 2026 CHIRANJIVI 🇰🇷
      </footer>
    </div>
  );
};

export default SearchBar;