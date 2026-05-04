import React, { useState } from 'react';
import axios from 'axios';

const symptoms_dict = {
  'itching': 0, 'skin_rash': 1, 'nodal_skin_eruptions': 2, 'continuous_sneezing': 3, 
  'shivering': 4, 'chills': 5, 'joint_pain': 6, 'stomach_pain': 7, 'acidity': 8,
  'fatigue': 14, 'weight_loss': 19, 'cough': 24, 'high_fever': 25, 'headache': 31,
  'chest_pain': 56, 'dizziness': 64, 'muscle_pain': 97
};

const CareForm = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const API_URL = "https://rander-api-online.onrender.com/api/predict";

  // Safely parse arrays from the backend response in case they are stringified
  const parseResponseArray = (dataField) => {
    if (!dataField) return [];
    if (Array.isArray(dataField)) {
      // If the array contains a single stringified array like "['Diet 1', 'Diet 2']"
      if (dataField.length === 1 && typeof dataField[0] === 'string' && dataField[0].startsWith('[')) {
        try {
          return JSON.parse(dataField[0].replace(/'/g, '"'));
        } catch (e) {
          return dataField[0].replace(/[\[\]']/g, '').split(',').map(s => s.trim());
        }
      }
      return dataField;
    }
    if (typeof dataField === 'string') {
      try {
        if (dataField.startsWith('[')) {
          return JSON.parse(dataField.replace(/'/g, '"'));
        }
        return dataField.split(',').map(s => s.trim());
      } catch (e) {
        return dataField.replace(/[\[\]']/g, '').split(',').map(s => s.trim());
      }
    }
    return [];
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!symptoms.trim()) return setError("Please enter symptoms");
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Clean up the input into a single comma-separated string
      const symptomPayload = symptoms
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .join(', ');

      const response = await axios.post(API_URL, { 
        symptoms: symptomPayload
      });

      if (response.data) {
        // Clean up stringified arrays returned by the API
        const cleanedResult = {
          description: response.data.description || "No description provided.",
          diet: parseResponseArray(response.data.diet),
          medications: parseResponseArray(response.data.medications),
          precautions: parseResponseArray(response.data.precautions),
          predicted_disease: response.data.predicted_disease || "Condition Detected",
          urgencyLevel: response.data.urgencyLevel || "medium"
        };
        setResult(cleanedResult);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to the medical server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const input = e.target.value;
    setSymptoms(input);
    const symptomsArray = input.split(',');
    const lastSymptom = symptomsArray[symptomsArray.length - 1].trim();

    if (lastSymptom) {
      const filtered = Object.keys(symptoms_dict).filter(s =>
        s.toLowerCase().includes(lastSymptom.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const symptomsArray = symptoms.split(',').map(s => s.trim()).filter(Boolean);
    symptomsArray[symptomsArray.length - 1] = suggestion;
    setSymptoms(symptomsArray.join(', ') + ', ');
    setSuggestions([]);
  };

  const getUrgencyStyles = (level) => {
    const normalized = level?.toLowerCase() || 'medium';
    if (normalized === 'emergency') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (normalized === 'high') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (normalized === 'medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 antialiased font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            Chiranjivi AI
          </h1>
          <p className="text-sm text-gray-500 mt-2">Intelligent Symptom Analysis & Clinical Support</p>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="relative">
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-2">
                Describe Symptoms
              </label>
              <input
                type="text"
                placeholder="e.g. high_fever, cough, headache"
                className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition duration-200 ease-in-out placeholder-zinc-600"
                value={symptoms}
                onChange={handleChange}
              />
              
              {/* Autocomplete */}
              {suggestions.length > 0 && (
                <ul className="absolute z-20 bg-zinc-900 border border-zinc-800 w-full rounded-xl mt-2 shadow-xl overflow-hidden backdrop-blur-lg">
                  {suggestions.map((s, i) => (
                    <li 
                      key={i} 
                      className="p-3.5 text-sm cursor-pointer hover:bg-emerald-600/20 hover:text-emerald-300 transition duration-150 border-b border-zinc-800/80 last:border-none" 
                      onClick={() => handleSuggestionClick(s)}
                    >
                      {s.replace(/_/g, ' ')}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold tracking-wide uppercase text-sm transition-all duration-300 transform ${
                loading 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 text-black active:scale-[0.98]'
              }`}
            >
              {loading ? 'Analyzing Neural Patterns...' : 'Predict Disease'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm text-center font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Output Cards */}
        {result && (
          <div className="mt-8 space-y-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {result.predicted_disease}
              </h2>
              <span className={`inline-block self-start px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getUrgencyStyles(result.urgencyLevel)}`}>
                {result.urgencyLevel} Urgency
              </span>
            </div>
            
            <p className="text-zinc-400 leading-relaxed italic text-sm md:text-base border-l-2 border-zinc-700 pl-4">
              {result.description}
            </p>

            <div className="h-[1px] bg-zinc-800 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Precautions */}
              <div className="bg-zinc-950/40 border border-zinc-800/50 p-4 rounded-xl">
                <h3 className="font-semibold text-emerald-400 text-sm tracking-wider uppercase mb-3">Precautions</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  {result.precautions?.length > 0 ? result.precautions.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>{p}</span>
                    </li>
                  )) : <li className="text-zinc-500">No specific precautions found.</li>}
                </ul>
              </div>

              {/* Recommended Diet */}
              <div className="bg-zinc-950/40 border border-zinc-800/50 p-4 rounded-xl">
                <h3 className="font-semibold text-teal-400 text-sm tracking-wider uppercase mb-3">Recommended Diet</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  {result.diet?.length > 0 ? result.diet.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-500 mt-1">•</span>
                      <span>{d}</span>
                    </li>
                  )) : <li className="text-zinc-500">No specific dietary recommendations.</li>}
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl text-xs text-zinc-500 leading-relaxed">
              <strong className="text-yellow-600 font-semibold uppercase tracking-wider block mb-1">Medical Disclaimer</strong> 
              This analysis is powered by AI and is meant strictly for educational purposes. It does not replace professional medical advice, diagnosis, or clinical evaluation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareForm;