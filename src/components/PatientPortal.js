import React, { useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/PatientPortal.css";
import { keccak256 } from "ethers"; // Import keccak256 for hashing the medical records link

const contractAddress = "0xF6AC235503c2e6257c13C1104E04225588754257"; // Replace with your deployed contract address
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "AccessGranted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_doctor",
        "type": "address"
      }
    ],
    "name": "allowDoctorAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "PatientDetailsUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_age",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_city",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "_medicalRecordsHash",
        "type": "bytes32"
      }
    ],
    "name": "setPatientDetails",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_doctor",
        "type": "address"
      }
    ],
    "name": "revokeDoctorAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPatientDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "age",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "medicalRecordsHash",
        "type": "bytes32"
      },
      {
        "internalType": "address[]",
        "name": "allowedDoctors",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const PatientPortal = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [medicalRecordsLink, setMedicalRecordsLink] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const connectToMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      notifyError("MetaMask is not installed!");
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      return provider.getSigner();
    } catch (error) {
      notifyError("Failed to connect to MetaMask!");
      console.error(error);
    }
  };

  const handleSetPatientDetails = async () => {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      // Hash the medical records link to bytes32
      const medicalRecordsHash = keccak256(ethers.toUtf8Bytes(medicalRecordsLink));
      const tx = await contract.setPatientDetails(name, age, city, medicalRecordsHash);
      await tx.wait();
      notifySuccess("Patient details set successfully!");
    } catch (error) {
      notifyError("Failed to set patient details!");
      console.error(error);
    }
  };

  const handleAllowDoctorAccess = async () => {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.allowDoctorAccess(doctorAddress);
      await tx.wait();
      notifySuccess("Doctor access granted!");
    } catch (error) {
      notifyError("Failed to grant doctor access!");
      console.error(error);
    }
  };

  const handleRevokeDoctorAccess = async () => {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.revokeDoctorAccess(doctorAddress);
      await tx.wait();
      notifySuccess("Doctor access revoked!");
    } catch (error) {
      notifyError("Failed to revoke doctor access!");
      console.error(error);
    }
  };

  const handleGetPatientDetails = async () => {
    const signer = await connectToMetaMask();
    if (!signer) return;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const details = await contract.getPatientDetails();
      setPatientDetails({
        name: details[0],
        age: details[1].toString(),
        city: details[2],
        medicalRecordsHash: details[3], // Display the hash for medical records
        allowedDoctors: details[4],
      });
      notifySuccess("Patient details fetched successfully!");
    } catch (error) {
      notifyError("Failed to fetch patient details!");
      console.error(error);
    }
  };

  return (
    <div>
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay loop muted>
          <source src="/Back.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="container">
        <h1>Patient Portal</h1>

        <div className="details-section">
          <h2>Set Your Details</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Medical Records Link"
            value={medicalRecordsLink}
            onChange={(e) => setMedicalRecordsLink(e.target.value)}
          />
          <button onClick={handleSetPatientDetails}>Submit Details</button>
        </div>

        <div className="grant-access-section">
          <h2>Grant Access to Doctor</h2>
          <input
            type="text"
            placeholder="Doctor's MetaMask Address"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
          />
          <button onClick={handleAllowDoctorAccess}>Grant Access</button>
        </div>

        <div className="revoke-access-section">
          <h2>Revoke Access from Doctor</h2>
          <input
            type="text"
            placeholder="Doctor's MetaMask Address"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
          />
          <button onClick={handleRevokeDoctorAccess}>Revoke Access</button>
        </div>

        <div className="view-details-section">
          <h2>View Your Details</h2>
          <button onClick={handleGetPatientDetails}>Fetch Details</button>
          {patientDetails && (
            <div>
              <p><strong>Name:</strong> {patientDetails.name}</p>
              <p><strong>Age:</strong> {patientDetails.age}</p>
              <p><strong>City:</strong> {patientDetails.city}</p>
              <p><strong>Medical Records Hash:</strong> {patientDetails.medicalRecordsHash}</p>
              <p><strong>Allowed Doctors:</strong> {patientDetails.allowedDoctors.join(", ")}</p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PatientPortal;
