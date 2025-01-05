import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import "../styles/UploadProjectPage.css";

// Replace these with your contract's details
const contractAddress = "0xeb86baf5a0cfcd4cbd68e2eb1703ae34adba853e";
const PatientDoctorPortalABI =[
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
		"inputs": [],
		"name": "getAccessiblePatients",
		"outputs": [
			{
				"components": [
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
						"internalType": "string",
						"name": "medicalRecordsLink",
						"type": "string"
					},
					{
						"internalType": "address[]",
						"name": "allowedDoctors",
						"type": "address[]"
					}
				],
				"internalType": "struct PatientDoctorPortal.Patient[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
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
				"internalType": "string",
				"name": "medicalRecordsLink",
				"type": "string"
			},
			{
				"internalType": "address[]",
				"name": "allowedDoctors",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
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
				"internalType": "string",
				"name": "_medicalRecordsLink",
				"type": "string"
			}
		],
		"name": "setPatientDetails",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const DoctorPortal = () => {
	const [account, setAccount] = useState(null);
	const [patients, setPatients] = useState([]);
	const [loading, setLoading] = useState(true);
  
	// Function to connect to MetaMask
	const connectToMetaMask = async () => {
	  if (typeof window.ethereum === 'undefined') {
		notifyError('MetaMask is not installed!');
		return null;
	  }
  
	  try {
		const provider = new ethers.BrowserProvider(window.ethereum);
		const accounts = await provider.send('eth_requestAccounts', []); // Request accounts
		setAccount(accounts[0]); // Set the first account
		return provider.getSigner(); // Return the signer for the first account
	  } catch (error) {
		notifyError('Failed to connect to MetaMask!');
		console.error(error);
	  }
	};
  
	// Fetch accessible patients for the doctor
	const fetchAccessiblePatients = async () => {
	  setLoading(true);
  
	  const signer = await connectToMetaMask();
	  if (!signer) {
		setLoading(false);
		return;
	  }
  
	  const contract = new ethers.Contract(contractAddress, PatientDoctorPortalABI, signer);
  
	  try {
		const accessiblePatients = await contract.getAccessiblePatients();
		setPatients(accessiblePatients);
		notifySuccess('Patient data loaded successfully!');
	  } catch (error) {
		notifyError('Failed to fetch patients!');
		console.error(error);
	  }
  
	  setLoading(false);
	};
  
	// Helper functions for notifications
	const notifyError = (message) => {
	  alert(`Error: ${message}`);
	};
  
	const notifySuccess = (message) => {
	  alert(`Success: ${message}`);
	};
  
	// UseEffect to fetch patients on component mount
	useEffect(() => {
	  fetchAccessiblePatients();
	}, []);
  
	return (
	  <div className="doctor-portal">
		{/* Background Video */}
		<video className="background-video" autoPlay loop muted>
		  <source src="/Back.mp4" type="video/mp4" />
		  Your browser does not support the video tag.
		</video>
  
		{/* Portal Content */}
		<div className="content">
		  <header>
			<h1>Doctor Portal</h1>
			<p>Connected Account: {account || "Not connected"}</p>
			<button onClick={connectToMetaMask}>Connect to MetaMask</button>
		  </header>
  
		  {loading ? (
			<p>Loading patient data...</p>
		  ) : patients.length > 0 ? (
			<div className="patient-list">
			  <h2>Patients Who Granted Access</h2>
			  <ul>
				{patients.map((patient, index) => (
				  <li key={index}>
					<p><strong>Name:</strong> {patient.name}</p>
					<p><strong>Age:</strong> {patient.age}</p>
					<p><strong>City:</strong> {patient.city}</p>
					<p>
					  <strong>Medical Records:</strong>{" "}
					  <a href={patient.medicalRecordsLink} target="_blank" rel="noopener noreferrer">
						View Records
					  </a>
					</p>
				  </li>
				))}
			  </ul>
			</div>
		  ) : (
			<p>No patients have granted access yet.</p>
		  )}
		</div>
	  </div>
	);
  };
  
  export default DoctorPortal;