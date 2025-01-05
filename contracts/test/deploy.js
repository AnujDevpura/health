const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const PatientDoctorPortal = await hre.ethers.getContractFactory("PatientDoctorPortal");
  
  // Deploy the contract
  const patientDoctorPortal = await PatientDoctorPortal.deploy();

  // Wait for the contract to be deployed
  await patientDoctorPortal.deployed();

  console.log("PatientDoctorPortal deployed to:", patientDoctorPortal.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
