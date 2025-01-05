// Blockchain.js (Updated for ethers v6+)
import { BrowserProvider } from 'ethers';

let provider;
let signer;
let userAddress;

// Connect to MetaMask
export const connectMetaMask = async () => {
  if (window.ethereum) {
    provider = new BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);  // Request accounts
    signer = await provider.getSigner(); // Ensure you await this call
    userAddress = await signer.getAddress(); // This should work now
    console.log('Connected Wallet:', userAddress);
    return userAddress;
  } else {
    alert('Please install MetaMask to use this feature');
  }
};

export const getSigner = () => signer;
export const getProvider = () => provider;
export const getUserAddress = () => userAddress;