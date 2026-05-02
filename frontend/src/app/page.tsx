"use client";

import React, { useState } from "react";

export default function GradePredictorDashboard() {
  const [formData, setFormData] = useState({
    studytime: "",
    failures: "",
    absences: "",
    G1: "",
    G2: "",
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

   
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studytime: parseFloat(formData.studytime),
          failures: parseFloat(formData.failures),
          absences: parseFloat(formData.absences),
          G1: parseFloat(formData.G1),
          G2: parseFloat(formData.G2),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction from the AI server.");
      }

    
      const data = await response.json();
      setPrediction(data.predicted_G3);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Is the Python backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-sans transition-all">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <header className="text-center mt-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm pb-2">
            Academic Performance AI
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light">
            Input the student's metrics below. Our Machine Learning model will analyze the data and predict their final period grade (G3).
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          
          <div className="bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/60 p-8 rounded-2xl shadow-2xl transition-all hover:bg-neutral-800/90">
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-neutral-700 pb-3 flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Student Metrics
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-neutral-300 mb-1 group-hover:text-blue-400 transition-colors">Study Time (1: &lt;2h, 2: 2-5h, 3: 5-10h, 4: &gt;10h)</label>
                <input
                  type="number"
                  name="studytime"
                  value={formData.studytime}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="4"
                  className="w-full bg-neutral-900/50 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-neutral-600"
                  placeholder="e.g. 2"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-neutral-300 mb-1 group-hover:text-amber-400 transition-colors">Past Class Failures (0-3)</label>
                <input
                  type="number"
                  name="failures"
                  value={formData.failures}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="3"
                  className="w-full bg-neutral-900/50 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-neutral-600"
                  placeholder="e.g. 0"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-neutral-300 mb-1 group-hover:text-rose-400 transition-colors">School Absences (0-93)</label>
                <input
                  type="number"
                  name="absences"
                  value={formData.absences}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full bg-neutral-900/50 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-neutral-600"
                  placeholder="e.g. 4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-medium text-neutral-300 mb-1 group-hover:text-emerald-400 transition-colors">Period 1 Grade (0-20)</label>
                  <input
                    type="number"
                    name="G1"
                    value={formData.G1}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="20"
                    step="0.1"
                    className="w-full bg-neutral-900/50 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-neutral-600"
                    placeholder="e.g. 12"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-neutral-300 mb-1 group-hover:text-emerald-400 transition-colors">Period 2 Grade (0-20)</label>
                  <input
                    type="number"
                    name="G2"
                    value={formData.G2}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="20"
                    step="0.1"
                    className="w-full bg-neutral-900/50 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-neutral-600"
                    placeholder="e.g. 13"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold py-3.5 rounded-xl shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 hover:shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   Predict Final Grade (G3)
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-start">
            <div className={`bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/60 p-8 rounded-2xl shadow-2xl h-full flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-700 ${prediction !== null ? 'ring-1 ring-blue-500/30' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 z-0 transition-opacity duration-1000 opacity-30 hover:opacity-100"></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <h3 className="text-xl font-medium text-neutral-400 mb-2 mt-4">Prediction Result</h3>
                
                {error && (
                  <div className="mt-6 p-4 w-full bg-red-900/40 border border-red-500/50 text-red-200 rounded-lg text-sm animate-pulse">
                    {error}
                  </div>
                )}

                {prediction !== null ? (
                  <div className="transform transition-all duration-700 translate-y-0 opacity-100 mt-8 w-full">
                    <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-3">Estimated Final Grade (G3)</p>
                    <div className="text-7xl font-black text-white drop-shadow-2xl mb-6">
                      {prediction.toFixed(1)} <span className="text-3xl text-neutral-500 font-medium">/ 20</span>
                    </div>
                    <div className="w-full bg-neutral-900/80 rounded-full h-4 mb-4 border border-neutral-700 shadow-inner overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${prediction >= 10 ? 'from-emerald-600 to-emerald-400' : 'from-rose-600 to-rose-400'}`} 
                        style={{ width: `${Math.min((prediction / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className={`font-medium text-sm px-4 py-2 rounded-full inline-block ${prediction >= 10 ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-800/50' : 'bg-red-900/30 text-red-300 border border-red-800/50'}`}>
                      {prediction >= 10 ? 'Student is predicted to pass.' : 'Student is predicted to fail. Intervention recommended.'}
                    </p>
                  </div>
                ) : !error && !loading && (
                  <div className="mt-16 opacity-30 flex flex-col items-center">
                     <svg className="w-24 h-24 text-neutral-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p className="text-sm max-w-xs">Awaiting data. Fill in the parameters and submit to view the AI analysis.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
