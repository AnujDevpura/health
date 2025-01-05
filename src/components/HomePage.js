import React, { useState } from "react";
import { connectMetaMask } from "./Blockchain"; // Import the MetaMask connection function
import { useNavigate } from "react-router-dom"; // For navigation
import "../styles/HomePage.css";

const HomePage = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    const address = await connectMetaMask();
    if (address) {
      setWalletConnected(true);
      setUserAddress(address);
      setShowOptions(true);
    }
  };

  const handleVoterClick = () => {
    navigate("/VoterPage"); // Navigate to the Voter page
  };

  const handleUploadProjectClick = () => {
    navigate("/UploadProjectPage"); // Navigate to the Upload Project page
  };

  return (
    <div className="home-page">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/Back.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="translucent-box">
        <h1>Welcome to De-EHR Platform</h1>

        {!walletConnected ? (
          <button className="connect-wallet-btn" onClick={handleConnect}>
            Connect MetaMask
          </button>
        ) : (
          <div>
            <p>Wallet Connected: {userAddress}</p>

            {showOptions && (
              <div className="options">
                <button className="option-btn" onClick={handleVoterClick}>
                  Patient Portal
                </button>
                <button className="option-btn" onClick={handleUploadProjectClick}>
                  Doctor Portal
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
