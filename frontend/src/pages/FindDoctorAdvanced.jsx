import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../services/axios";
import SendFriendRequest from "../components/SendFriendRequest";
import { getSentRequests } from "../services/friendRequest";

const FindDoctor = () => {
  const currentUser = useSelector((state) => state.user.user);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sentRequests, setSentRequests] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
    fetchSentRequests();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await API.get("/doctor");
      setDoctors(response.data.doctors || response.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await getSentRequests();
      const requestMap = {};
      if (response.requests) {
        response.requests.forEach((req) => {
          requestMap[req.receiver._id] = req._id;
        });
      }
      setSentRequests(requestMap);
    } catch (error) {
      console.error("Failed to fetch sent requests:", error);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    const user = doctor.user || doctor;
    return (
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (doctor.specialization &&
        doctor.specialization.toLowerCase().includes(searchLower)) ||
      (doctor.hospital &&
        doctor.hospital.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Find a Doctor
        </h1>
        <p className="text-gray-600 mb-8">
          Connect with qualified healthcare professionals
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, specialization, or hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
          />
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">
                No doctors found matching your search
              </p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => {
              const user = doctor.user || doctor;
              const doctorId = doctor._id;
              const hasSentRequest = sentRequests[doctorId];

              return (
                <div
                  key={doctor._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  {/* Doctor Image */}
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center">
                    <img
                      src={
                        user.avatar ||
                        doctor.avatar ||
                        "https://via.placeholder.com/200"
                      }
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Doctor Info */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Dr. {user.name}
                    </h2>

                    <div className="space-y-3 mb-6">
                      <p className="text-lg font-semibold text-blue-600">
                        {doctor.specialization}
                      </p>

                      {doctor.experience && (
                        <p className="text-gray-600">
                          <span className="font-semibold">
                            Experience:
                          </span>{" "}
                          {doctor.experience} years
                        </p>
                      )}

                      {doctor.hospital && (
                        <p className="text-gray-600">
                          <span className="font-semibold">
                            Hospital:
                          </span>{" "}
                          {doctor.hospital}
                        </p>
                      )}

                      {doctor.consultationFee && (
                        <p className="text-gray-600">
                          <span className="font-semibold">
                            Consultation Fee:
                          </span>{" "}
                          ₹{doctor.consultationFee}
                        </p>
                      )}

                      {doctor.rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">
                            {"⭐".repeat(Math.round(doctor.rating))}
                          </span>
                          <span className="text-gray-600">
                            {doctor.rating}/5 ({doctor.reviews} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Request Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      disabled={hasSentRequest}
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                        hasSentRequest
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {hasSentRequest
                        ? "Request Pending"
                        : "Send Friend Request"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDoctor(null)}
              className="float-right text-2xl text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>

            <div className="flex gap-6 mb-6">
              <img
                src={
                  selectedDoctor.avatar ||
                  selectedDoctor.user?.avatar ||
                  "https://via.placeholder.com/150"
                }
                alt={selectedDoctor.user?.name}
                className="w-40 h-40 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Dr. {selectedDoctor.user?.name}
                </h2>

                <p className="text-xl text-blue-600 font-semibold mb-4">
                  {selectedDoctor.specialization}
                </p>

                <div className="space-y-2 text-gray-600">
                  {selectedDoctor.qualifications && (
                    <p>
                      <span className="font-semibold">
                        Qualifications:
                      </span>{" "}
                      {selectedDoctor.qualification}
                    </p>
                  )}

                  {selectedDoctor.experience && (
                    <p>
                      <span className="font-semibold">
                        Experience:
                      </span>{" "}
                      {selectedDoctor.experience} years
                    </p>
                  )}

                  {selectedDoctor.hospital && (
                    <p>
                      <span className="font-semibold">Hospital:</span>{" "}
                      {selectedDoctor.hospital}
                    </p>
                  )}

                  {selectedDoctor.location?.city && (
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {selectedDoctor.location.city}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Available Slots */}
            {selectedDoctor.availableSlots &&
              selectedDoctor.availableSlots.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Available Slots
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedDoctor.availableSlots.map(
                      (slot, index) => (
                        <div
                          key={index}
                          className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <p className="font-semibold text-gray-800">
                            {slot.day}
                          </p>
                          <p className="text-sm text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Send Request Form */}
            <SendFriendRequest
              doctorId={selectedDoctor._id}
              doctorName={selectedDoctor.user?.name}
              doctorAvatar={
                selectedDoctor.avatar ||
                selectedDoctor.user?.avatar
              }
              doctorSpecialization={
                selectedDoctor.specialization
              }
              currentUserId={currentUser?._id}
              isPending={!!sentRequests[selectedDoctor._id]}
              requestId={sentRequests[selectedDoctor._id]}
              onRequestSent={(request) => {
                if (request) {
                  setSentRequests((prev) => ({
                    ...prev,
                    [selectedDoctor._id]: request._id,
                  }));
                } else {
                  setSentRequests((prev) => {
                    const newState = { ...prev };
                    delete newState[selectedDoctor._id];
                    return newState;
                  });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FindDoctor;
