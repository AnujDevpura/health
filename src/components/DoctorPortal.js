import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';  // For navigation
import "../styles/DoctorPortal.css";

// Replace with your contract address
const contractAddress = "0xF6AC235503c2e6257c13C1104E04225588754257";

// ABI of the smart contract
const ProjectRegistry = [
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_license", "type": "string" }
        ],
        "name": "registerDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "_doctor", "type": "address" }
        ],
        "name": "allowDoctorAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "_doctor", "type": "address" }
        ],
        "name": "revokeDoctorAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAccessiblePatients",
        "outputs": [
            { "internalType": "address[]", "name": "patientAddresses", "type": "address[]" },
            { "internalType": "string[]", "name": "names", "type": "string[]" },
            { "internalType": "uint256[]", "name": "ages", "type": "uint256[]" },
            { "internalType": "string[]", "name": "cities", "type": "string[]" },
            { "internalType": "bytes32[]", "name": "recordHashes", "type": "bytes32[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const DoctorPortal = () => {
    const [account, setAccount] = useState(null);
    const [patients, setPatients] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [doctorLicense, setDoctorLicense] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();  // Initialize useNavigate hook

    const connectToMetaMask = async () => {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return null;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            return provider.getSigner();
        } catch (error) {
            alert("Failed to connect to MetaMask!");
            console.error(error);
        }
    };

    const registerDoctor = async () => {
        if (!doctorName || !doctorLicense) {
            alert("Please provide both name and license.");
            return;
        }

        const signer = await connectToMetaMask();
        if (!signer) {
            alert("Please connect to MetaMask.");
            return;
        }

        const contract = new ethers.Contract(contractAddress, ProjectRegistry, signer);
        try {
            const tx = await contract.registerDoctor(doctorName, doctorLicense);
            await tx.wait();
            alert(`Doctor ${doctorName} has been successfully registered!`);
        } catch (error) {
            alert("Failed to register doctor.");
            console.error(error);
        }
    };

    const fetchAccessiblePatients = useCallback(async () => {
        setLoading(true);
        const signer = await connectToMetaMask();
        if (!signer) {
            setLoading(false);
            return;
        }

        const contract = new ethers.Contract(contractAddress, ProjectRegistry, signer);
        try {
            const [patientAddresses, names, ages, cities, recordHashes] = await contract.getAccessiblePatients();
            
            // Debugging: Log the returned data
            console.log("Patient Data:", patientAddresses, names, ages, cities, recordHashes);

            if (patientAddresses.length === 0) {
                alert("No patients available or access is not granted yet.");
                setLoading(false);
                return;
            }

            const patientData = patientAddresses.map((address, index) => ({
                address,
                name: names[index],
                age: ages[index].toString(),
                city: cities[index],
                medicalRecordsLink: `https://example.com/records/${recordHashes[index]}`  // This is where you generate the actual link
            }));
            
            // Set the patients in the state
            setPatients(patientData);
        } catch (error) {
            alert("Failed to fetch accessible patients.");
            console.error("Error fetching patient data:", error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (account) {
            fetchAccessiblePatients();
        }
    }, [account, fetchAccessiblePatients]);

    // Navigate to the Admin page
    const handleAdminClick = () => {
        navigate("/Admin");  // Navigate to Admin page
    };

    return (
        <div className="doctor-portal">
            <video className="background-video" autoPlay loop muted>
                <source src="/Back.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="overlay"></div>

            <div className="content">
                <div className="container">
                <header>
                    <h1>Doctor Portal</h1>
                    <p>Connected Account: {account || "Not connected"}</p>
                    <button onClick={connectToMetaMask}>Connect to MetaMask</button>
                </header>

                {/* Patient List */}
                {loading ? (
                    <p>Loading patient data...</p>
                ) : (
                    <div className="patient-list">
                        <h2>Patients Who Granted Access</h2>
                        {patients.length > 0 ? (
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
                        ) : (
                            <p>No patients found.</p>
                        )}
                    </div>
                )}

                {/* Register Doctor form */}
                <div>
                    {!account ? (
                        <p>Please connect to MetaMask to register as a doctor.</p>
                    ) : (
                        <div>
                            <h2>Register Doctor</h2>
                            <form onSubmit={(e) => { e.preventDefault(); registerDoctor(); }}>
                                <input
                                    type="text"
                                    placeholder="Enter Doctor's Name"
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Doctor's License"
                                    value={doctorLicense}
                                    onChange={(e) => setDoctorLicense(e.target.value)}
                                    required
                                />
                                <button type="submit">Register Doctor</button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Admin Page Button */}
                <div>
                    <br></br>
                    <button onClick={handleAdminClick}>Go to Admin Page</button>
                </div>
                </div>
            </div>
            </div>
    );
};

export default DoctorPortal;
