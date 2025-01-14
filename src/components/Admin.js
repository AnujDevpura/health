import React, { useState } from 'react';
import { ethers } from 'ethers';
import ProjectRegistry from './ProjectRegistry.json'; // Update with the actual ABI
import "../styles/Admin.css";


const Admin = ({ contractAddress }) => {
    const [newOwner, setNewOwner] = useState('');
    const [doctorAddress, setDoctorAddress] = useState('');
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Connect to MetaMask
    const connectToMetaMask = async () => {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            return provider.getSigner();
        } else {
            alert('MetaMask not found');
            return null;
        }
    };

    // Verify a doctor
    const verifyDoctor = async () => {
        if (!doctorAddress) {
            setMessage('Please provide a doctor address.');
            return;
        }
        setIsProcessing(true);
        setMessage('Verifying doctor...');

        try {
            const signer = await connectToMetaMask();
            const contract = new ethers.Contract(contractAddress, ProjectRegistry, signer);
            await contract.verifyDoctor(doctorAddress);
            setMessage('Doctor verified successfully!');
        } catch (error) {
            console.error("Error verifying doctor:", error);
            setMessage('Failed to verify doctor.');
        }
        setIsProcessing(false);
    };

    // Transfer ownership
    const transferOwnership = async () => {
        if (!newOwner) {
            setMessage('Please provide a new owner address.');
            return;
        }
        setIsProcessing(true);
        setMessage('Transferring ownership...');

        try {
            const signer = await connectToMetaMask();
            const contract = new ethers.Contract(contractAddress, ProjectRegistry, signer);
            await contract.transferOwnership(newOwner);
            setMessage('Ownership transferred successfully!');
        } catch (error) {
            console.error("Error transferring ownership:", error);
            setMessage('Failed to transfer ownership.');
        }
        setIsProcessing(false);
    };

    return (
        <div>
            <div className="video-background">
                <video autoPlay loop muted>
                <source src="/Back.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="overlay"></div>

            <div className="container">
            <h1>Admin Panel</h1>
            <div>
                <h2>Verify Doctor</h2>
                <input
                    type="text"
                    placeholder="Enter Doctor Address"
                    value={doctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                />
                <button onClick={verifyDoctor} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Verify Doctor'}
                </button>
            </div>

            <div>
                <h2>Transfer Ownership</h2>
                <input
                    type="text"
                    placeholder="Enter New Owner Address"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                />
                <button onClick={transferOwnership} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Transfer Ownership'}
                </button>
            </div>
            </div>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Admin;
