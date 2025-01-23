import React, { useState, useEffect } from "react";
import axios from "axios";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    user_d: "",
    name: "",
    age: "",
    gender: "",

    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("email");
    const storedAuthCredentials = localStorage.getItem("authCredentials");
    
    if (storedUserId && storedEmail && storedAuthCredentials) {
      setFormData(prevData => ({
        ...prevData,
        user_d: storedUserId,
        email: storedEmail
      }));
    } else {
      window.location.href = "/login";
    }
  }, []);

  const getAuthHeader = () => {
    const email = localStorage.getItem("email");
    const storedAuthCredentials = localStorage.getItem("authCredentials");
    
    if (!email || !storedAuthCredentials) {
      throw new Error("Authentication credentials not found");
    }

    const username = email;
    const password = atob(storedAuthCredentials).split(':')[1];
    const credentials = btoa(`${username}:${password}`);
    console.log(username,password,credentials);

    return `Basic ${credentials}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      const age = parseInt(value);
      if (age < 0 || age > 150) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const downloadReport = async () => {
    if (!patientId) {
      setError("No patient ID available. Please submit patient information first.");
      return;
    }
    setDownloadLoading(true);
    setError("");

    try {
      const authHeader = getAuthHeader();
      const response = await axios.get(
        `http://localhost:8000/download-report/${patientId}/`,
        {
          headers: {
            Authorization: authHeader,
          },
          responseType: 'blob'
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patient_report_${patientName || 'unknown'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading report:", error);
      setError(
        error.response?.data?.error ||
        "Failed to download report"
      );
    } finally {
      setDownloadLoading(false);
    }
  };

  const generateReport = async () => {
    if (!patientId) {
      setError("No patient ID available. Please submit patient information first.");
      return;
    }
    setReportLoading(true);
    setError("");
    
    try {
      const authHeader = getAuthHeader();
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const response = await axios.post(
        `http://localhost:8000/api/report/${patientId}/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader,
            "X-CSRFToken": csrfToken
          }
        }
      );

      // Handle successful report generation
      console.log("Report generated:", response.data);
      // You might want to download the report or show it in a new window
      if (response.data.report_url) {
        window.open(response.data.report_url, '_blank');
      }

    } catch (error) {
      console.error("Error generating report:", error.response || error);
      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Failed to generate report"
      );
    } finally {
      setReportLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      const authHeader = getAuthHeader();
      console.log("Auth Header:", authHeader);
      console.log("Form Data Sent:", formData);
      console.log("Request Data:", {
        formData,
        headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
        }
      });

      const response = await axios.post(
        "http://localhost:8000/api/patients/create/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
          }
        }
      );

      console.log("Success Response:", response.data);
      // Store the patient ID and name from the response
      if (response.data.id) {
        setPatientId(response.data.id);
        setPatientName(formData.name); // Store the patient name
        setSuccess(true);
      }
      
      setFormData(prev => ({
        user_d: prev.user_d,
        name: "",
        age: "",
        gender: "",
        email: "",
      }));

    } catch (error) {
      console.error("Error Response:", error.response || error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("authCredentials");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        return;
      }
      
      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">New Patient Registration</h2>
      
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Patient record created successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="name" className="block mb-2">Patient Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <label htmlFor="age" className="block mb-2">Age</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        <label htmlFor="gender" className="block mb-2">Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label htmlFor="email" className="block mb-2">Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        
        <div className="flex space-x-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          
          <button 
            type="button"
            onClick={generateReport}
            disabled={reportLoading || !patientId}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {reportLoading ? 'Generating...' : 'Generate Report and send to email'}
          </button>

          <button 
            type="button"
            onClick={downloadReport}
            disabled={downloadLoading || !patientId}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {downloadLoading ? 'Downloading...' : 'Download Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;