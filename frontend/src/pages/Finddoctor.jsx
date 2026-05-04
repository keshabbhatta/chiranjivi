import React, { useState } from 'react';
import { SearchIcon, LocationMarkerIcon } from '@heroicons/react/solid';

const SearchBar = () => {
  const hospitals = [
    
 { name: "Alka Hospital", location: "lalitpur" },
 { name: "Anandaban Hospital", location: "Tika Bhairab, Lele, Lalitpur" },
 { name: "Arbuda Rog Nibaran Santha", location: "bagbazar, kathmandu" },
 { name: "B & B Hospital", location: "Gwarko, kathmandu" },
 { name: "Bhaktapur Cancer Hospital", location: "bhaktapur" },
 { name: "Bheri Hospital", location: "nepalgunj" },
    { name: "Biratnagar Eye Hospital", location: "biratnagar" },
    { name: "bir Hospital", location: "Tundikhel, kathmandu" },
    { name: "Birendra Hospital", location: "chhauni, kathmandu" },
    { name: "Bogoni Vision Center", location: "dhanusa" },
    { name: "B.P. Koirala Institute of Health Sciences", location: "dharan"},
    { name: "Dhanusa Hospital", location: "Dhanusa" },
    { name: "DI Skin Hospital and Referral Center", location: "Golfutar, Budhanilkantha, Kathmandu" },
    { name: "Far Western Regional Eye Hospital", location: "Dhangadhi" },
    { name: "Gandhi Tulasi Manohara Community Hospital", location: "Kadaghari, Kathmandu" },
    { name: "Grande Hospital", location: "Dhapasi, Kathmandu" },
    { name: "Hetauda Hospital", location: "Hetauda, Makwanpur, Bagmati Province, Nepal" },
    { name: "Human Organ Transplant Centre", location: "Dudhpati-17, Bhaktapur, Bagmati Province, Nepal" },
    { name: "Province Hospital Janakpur", location: "Janakpur" },
    { name: "Janaki Medical College", location: "Janakpur" },
    { name: "Kanti Children's Hospital", location: "Kathmandu" },
    { name: "Karnali Academy of Health Sciences", location: "Jumla" },
    { name: "Karnali Provincial Hospital", location: "Surkhet, Karnali Province, Nepal" },
    { name: "Kathmandu Cancer Center Hospital", location: "Tathali Nala Road, Bhaktapur" },
    { name: "Kirtipur Hospital", location: "Kirtipur, Kathmandu" },
    { name: "Koshi Hospital", location: "Biratnagar-10, Morang, Koshi Province, Nepal" },
    { name: "Kunde Hospital", location: "Kunde, Solukhumbu" },
    { name: "Lumbini Provincial Hospital", location: "Butwal, Lumbini Province, Nepal" },
    { name: "Madan Bhandari Academy of Health Sciences", location: "Hetauda, Bagmati Province, Nepal" },
    { name: "Mahakali Provincial Hospital", location: "mahendranagar" },
    { name: "Mahatma Gandhi Memorial Hospital (Bhojpur)", location: "Bhojpur" },
    { name: "Motherland Hospital", location: "Pepsicola, Kathmandu" },
    { name: "National Cardiac Centre", location: "Basundhara, Kathmandu" },
    { name: "Narayani Zonal Hospital", location: "Birgunj" },
    { name: "National Tuberculosis Control Center", location: "Thimi, Bhaktapur" },
    { name: "Nepal Eye Hospital", location: "Tripureshwor, Kathmandu" },
    { name: "Nepal Medical College Teaching Hospital", location: "Jorpati, Kathmandu" },
    { name: "Nepal Mediciti Hospital", location: "Nakhkhu Patan, Karyabinayak" },
    { name: "Nepal Police Hospital", location: "Maharajganj (Panipokhari), Kathmandu, Bagmati Province, Nepal" },
    { name: "Nobel Medical College Teaching Hospital", location: "Biratnagar" },
    { name: "Norvic Hospital", location: "Thapathali, Kathmandu" },
    { name: "Om Hospital & Research Centre", location: "Chabahil, Kathmandu" },
    { name: "Paropakar Maternity and Women's Hospital", location: "Kathmandu" },
    { name: "Patan Hospital", location: "Patan" },
    { name: "Patan Mental Hospital", location: "Lagankhel, Lalitpur" },
    { name: "Provincial Hospital Bhadrapur", location: "Bhadrapur Municipality-08, Koshi Province, Nepal" },
    { name: "Rapti Academy of Health Sciences", location: "Ghorahi, Lumbini Province, Nepal" },
    { name: "Rapti Provincial Hospital", location: "Tulsipur, Dang, Lumbini Province, Nepal" },
    { name: "Rapti Eye Hospital", location: "Tulsipur, Dang, Lumbini Province, Nepal" },
    { name: "R.M. Kedia Eye Hospital", location: "Lipani, Birgunj" },
    { name: "Sagarmatha Choudhary Eye Hospital, Lahan", location: "Lahan, Siraha" },
    { name: "Sagarmatha Zonal Hospital", location: "Rajbiraj" },
    { name: "Salyan District Hospital", location: "Khalanga, Salyan, Karnali Province, Nepal" },
    { name: "Seti Provincial Hospital", location: "Dhangadi, Kailali, Sudurpashchim Province, Nepal" },
    { name: "Shahid Gangalal National Heart Center", location: "Bansbari, Kathmandu" },
    { name: "Siddhartha Children and Women Hospital", location: "Butwal, Rupandehi" },
    { name: "Siddhasthali Rural Community Hospital", location: "Hetauda" },
    { name: "Solu District Hospital", location: "Phaplu, Solukhumbu" },
    { name: "Sukraraj Tropical and Infectious Disease Hospital", location: "Teku, Kathmandu" },
    { name: "Tansen Mission Hospital", location: "Palpa, Nepal" },
    { name: "Tilganga Institute of Ophthalmology", location: "Gaushala, Bagmati Bridge, Kathmandu" },
    { name: "Tribhuvan University Teaching Hospital", location: "Maharajganj, Kathmandu" },
    { name: "Udayapur District Hospital", location: "Triyuga Municipality, Udayapur district, Nepal" },
    { name: "Vayodha Hospital", location: "Balkhu, Kathmandu" },
    { name: "Hams Hospital", location: "Dhumbarahi" },
    { name: "Chest Clinic of Kathmandu", location: "Dillibazar" },
    { name: "Binaytara Foundation Cancer Center (BTFCC)", location: "Madesh Province, Janakpur, Nepal" },
    { name: "Saptakoshi Neuro Hospital", location: "Bhokraha ward no.2, near the banks of Sunsari River, Sunsari District" },
    { name: "Dr. Purushottam Adhikari's Mind Clinic", location: "Radhakrishna Mandir, Raniban, Kathmandu, Nepal" },
    { name: "ERA International Hospital Pvt. Ltd.", location: "Sorakhutte, Kathmandu" }
];

const doctors = [
    { name: "Dr. Aayush Sharma", hospital: "Alka Hospital" },
    { name: "Dr. Bina Raut", hospital: "Anandaban Hospital" },
    { name: "Dr. Shyam Pathak", hospital: "Arbuda Rog Nibaran Santha" },
    { name: "Dr. Sunita Shrestha", hospital: "B & B Hospital" },
    { name: "Dr. Ram Krishna", hospital: "Bhaktapur Cancer Hospital" },
    { name: "Dr. Megha Pokhrel", hospital: "Bheri Hospital" },
    { name: "Dr. Nitesh Ranjan", hospital: "Biratnagar Eye Hospital" },
    { name: "Dr. Sita Rai", hospital: "Bir Hospital" },
    { name: "Dr. Kiran Thapa", hospital: "Birendra Hospital" },
    { name: "Dr. Keshav Regmi", hospital: "Bogoni Vision Center" },
    { name: "Dr. Sarita Karki", hospital: "B.P. Koirala Institute of Health Sciences"},
    { name: "Dr. Suman Sharma", hospital: "Dhanusa Hospital" },
    { name: "Dr. Priya Thapa", hospital: "DI Skin Hospital and Referral Center" },
    { name: "Dr. Anil Yadav", hospital: "Far Western Regional Eye Hospital" },
    { name: "Dr. Maya Joshi", hospital: "Gandhi Tulasi Manohara Community Hospital" },
    { name: "Dr. Ravi Khanal", hospital: "Grande Hospital" },
    { name: "Dr. Sabin Acharya", hospital: "Hetauda Hospital" },
    { name: "Dr. Rina Chaudhary", hospital: "Human Organ Transplant Centre" },
    { name: "Dr. Nita Rathi", hospital: "Province Hospital Janakpur" },
    { name: "Dr. Samir Ghimire", hospital: "Janaki Medical College" },
    { name: "Dr. Pooja Bhandari", hospital: "Kanti Children's Hospital" },
    { name: "Dr. Kumar Thapa", hospital: "Karnali Academy of Health Sciences" },
    { name: "Dr. Ramesh Shrestha", hospital: "Karnali Provincial Hospital" },
    { name: "Dr. Aditi Pradhan", hospital: "Kathmandu Cancer Center Hospital" },
    { name: "Dr. Suraj Bhatta", hospital: "Kirtipur Hospital" },
    { name: "Dr. Reena Rai", hospital: "Koshi Hospital" },
    { name: "Dr. Sandeep Khatri", hospital: "Kunde Hospital" },
    { name: "Dr. Manisha Joshi", hospital: "Lumbini Provincial Hospital" },
    { name: "Dr. Shweta Bhattarai", hospital: "Madan Bhandari Academy of Health Sciences" },
    { name: "Dr. Gaurav Sharma", hospital: "Mahakali Provincial Hospital" },
    { name: "Dr. Kamal Adhikari", hospital: "Mahatma Gandhi Memorial Hospital (Bhojpur)" },
    { name: "Dr. Priya Singh", hospital: "Motherland Hospital" },
    { name: "Dr. Nirmal Regmi", hospital: "National Cardiac Centre" },
    { name: "Dr. Parijat Kafle", hospital: "Narayani Zonal Hospital" },
    { name: "Dr. Maya Tamang", hospital: "National Tuberculosis Control Center" },
    { name: "Dr. Subash Thakuri", hospital: "Nepal Eye Hospital" },
    { name: "Dr. Anisha Pradhan", hospital: "Nepal Medical College Teaching Hospital" },
    { name: "Dr. Binita Gurung", hospital: "Nepal Mediciti Hospital" },
    { name: "Dr. Shyam Kandel", hospital: "Nepal Police Hospital" },
    { name: "Dr. Ram Bhandari", hospital: "Nobel Medical College Teaching Hospital" },
    { name: "Dr. Gita Neupane", hospital: "Norvic Hospital" },
    { name: "Dr. Mohan Shrestha", hospital: "Om Hospital & Research Centre" },
    { name: "Dr. Anjali Shrestha", hospital: "Paropakar Maternity and Women's Hospital" },
    { name: "Dr. Pratik Ghimire", hospital: "Patan Hospital" },
    { name: "Dr. Tanisha Thapa", hospital: "Patan Mental Hospital" },
    { name: "Dr. Rajesh Sharma", hospital: "Provincial Hospital Bhadrapur" },
    { name: "Dr. Deepa Chaudhary", hospital: "Rapti Academy of Health Sciences" },
    { name: "Dr. Rakesh Joshi", hospital: "Rapti Provincial Hospital" },
    { name: "Dr. Suman Yadav", hospital: "Rapti Eye Hospital" },
    { name: "Dr. Nitin Yadav", hospital: "R.M. Kedia Eye Hospital" },
    { name: "Dr. Anita Jha", hospital: "Sagarmatha Choudhary Eye Hospital, Lahan" },
    { name: "Dr. Aakash Kumar", hospital: "Sagarmatha Zonal Hospital" },
    { name: "Dr. Dinesh Bhatt", hospital: "Salyan District Hospital" },
    { name: "Dr. Bhushan Joshi", hospital: "Seti Provincial Hospital" },
    { name: "Dr. Amrit Yadav", hospital: "Shahid Gangalal National Heart Center" },
    { name: "Dr. Preeti Sharma", hospital: "Siddhartha Children and Women Hospital" },
    { name: "Dr. Prakash Thapa", hospital: "Siddhasthali Rural Community Hospital" },
    { name: "Dr. Rishav Shrestha", hospital: "Solu District Hospital" },
    { name: "Dr. Mahesh Kumar", hospital: "Sukraraj Tropical and Infectious Disease Hospital" },
    { name: "Dr. Suresh Ghimire", hospital: "Tansen Mission Hospital" },
    { name: "Dr. Aditi Singh", hospital: "Tilganga Institute of Ophthalmology" },
    { name: "Dr. Prashant Chaudhary", hospital: "Tribhuvan University Teaching Hospital" },
    { name: "Dr. Jaya Rathi", hospital: "Udayapur District Hospital" },
    { name: "Dr. Binod Shah", hospital: "Vayodha Hospital" },
    { name: "Dr. Pawan Thapa", hospital: "Hams Hospital" },
    { name: "Dr. Suman Rai", hospital: "Chest Clinic of Kathmandu" },
    { name: "Dr. Anurag Ghimire", hospital: "Binaytara Foundation Cancer Center (BTFCC)" },
    { name: "Dr. Rajendra Thapa", hospital: "Saptakoshi Neuro Hospital" },
    { name: "Dr. Shashi Rathi", hospital: "Dr. Purushottam Adhikari's Mind Clinic" },
    { name: "Dr. Ranjan Khatri", hospital: "ERA International Hospital Pvt. Ltd." }
];


  const providerLinks = [
    { icon: "🦷", title: "Find dental providers", description: "Search dentist" },
    { icon: "👓", title: "Find vision care providers", description: "Search a vision care provider" },
    { icon: "🧠", title: "Find mental health providers", description: "Search mental health/behavioral health providers" },
    { icon: "💊", title: "Find network pharmacies", description: "Search a network pharmacy" },
  ];

  // State to handle input and results
  const [doctorName, setDoctorName] = useState('');
  const [location, setLocation] = useState('');
  const [filteredResult, setFilteredResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true); 
    let filteredHospital = null;
    let matchedDoctor = null;

    // Check if hospital name is entered in the doctor field
    if (doctorName) {
      filteredHospital = hospitals.find((hosp) =>
        hosp.name.toLowerCase().includes(doctorName.toLowerCase())
      );
      matchedDoctor = doctors.find((doc) => doc.hospital === filteredHospital?.name);

      if (filteredHospital) {
        setFilteredResult({ hospital: filteredHospital, doctor: matchedDoctor });
        return;
      }
    }

    // If location is provided but doctor name is not
    if (location && !doctorName) {
      filteredHospital = hospitals.find((hosp) =>
        hosp.location.toLowerCase().includes(location.toLowerCase())
      );

      if (filteredHospital) {
        const doctor = doctors.find((doc) => doc.hospital === filteredHospital.name);
        setFilteredResult({ hospital: filteredHospital, doctor });
        return;
      }
    }

    // If no results found
    setFilteredResult(null);
  };
  const getGoogleMapsLink = (location) => {
    const googleMapsUrl = `https://www.google.com.np/maps/search/hospitals+in+${encodeURIComponent(location)}`;
    return googleMapsUrl;
};

const handleLocateMe = () => {
    if (location) {
        window.open(getGoogleMapsLink(location), "_blank");
    } else {
        alert("Please enter a location to locate.");
    }
};

return (
    <div className="bg-blue-900 text-white min-h-screen flex flex-col items-center px-4">
      <header className="py-4 w-full flex justify-center items-center">
        <div className="text-lg font-semibold">Chiranjivi</div>
      </header>

      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold">Find Doctors and Health Assistance Near You</h1>
        <p className="mt-2 text-lg">A trusted platform that you can believe</p>
      </div>

      <div className="mt-8 flex flex-col items-center w-full">
        <div className="flex flex-col md:flex-row w-full md:w-auto items-center mb-2">
          <div className="relative mb-2 md:mb-0 md:mr-2 w-full md:w-auto">
            <input
              type="text"
              className="px-10 py-2 w-full md:w-96 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Search doctor or hospital name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
            <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="relative mb-2 md:mb-0 md:mr-2 w-full md:w-auto">
            <input
              type="text"
              className="px-10 py-2 w-full md:w-42 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <LocationMarkerIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            SEARCH
          </button>
          <button
            onClick={handleLocateMe}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none md:ml-2"
          >
            LOCATE ME
          </button>
        </div>
      </div>

      <div className="mt-4 text-black-400 text-center">
        <p>You can also search by physician or hospital name</p>
      </div>

      {/* Display search result */}
      {searched && (
        <div className="mt-12 bg-white py-12 w-full flex flex-col items-center">
          {filteredResult ? (
            <>
              <h2 className="text-2xl font-bold text-blue-900">Hospital Found:</h2>
              <p className="mt-4 text-lg text-blue-700">
                {filteredResult.hospital.name} - {filteredResult.hospital.location}
              </p>
              {filteredResult.doctor && (
                <p className="mt-2 text-lg text-gray-700">Doctor: {filteredResult.doctor.name}</p>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-700">No hospital or doctor found matching your search.</p>
              {location && (
                <a
                  href={getGoogleMapsLink(location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-600 underline"
                >
                  Search hospitals in {location} on Google Maps
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-12 w-full flex flex-wrap justify-center bg-white py-12">
        {providerLinks.map((link, index) => (
          <div key={index} className="w-full md:w-1/4 flex flex-col items-center p-4">
            <div className="text-4xl">{link.icon}</div>
            <h3 className="mt-4 text-lg font-bold text-blue-900">{link.title}</h3>
            <p className="mt-2 text-blue-500">{link.description}☝️</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

