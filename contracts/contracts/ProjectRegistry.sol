// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientDoctorPortal {

    // Structure to hold patient details
    struct Patient {
        string name;
        uint age;
        string city;
        bytes32 medicalRecordsHash; // Store hash instead of direct link
        mapping(address => bool) isAllowedDoctor; // More efficient doctor tracking
        address[] allowedDoctors;
        bool isRegistered;
    }

    // Structure to hold doctor details
    struct Doctor {
        string name;
        string license;
        bool isVerified;
        bool isActive;
    }

    // State variables
    address public owner;
    mapping(address => Patient) private patients;
    mapping(address => Doctor) private doctors;
    address[] public patientList; // List to store patient addresses for easy access

    // Events
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    event PatientDetailsUpdated(address indexed patient);
    event DoctorRegistered(address indexed doctor);
    event DoctorVerified(address indexed doctor);
    event DoctorDeactivated(address indexed doctor);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRegisteredPatient() {
        require(patients[msg.sender].isRegistered, "Patient not registered");
        _;
    }

    modifier onlyVerifiedDoctor() {
        require(doctors[msg.sender].isVerified && doctors[msg.sender].isActive, "Not an active verified doctor");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Transfer ownership to a new address
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    // Function for registering a doctor
    function registerDoctor(string memory _name, string memory _license) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_license).length > 0, "License cannot be empty");
        require(!doctors[msg.sender].isVerified, "Doctor already registered");

        doctors[msg.sender] = Doctor({
            name: _name,
            license: _license,
            isVerified: false,
            isActive: false
        });

        emit DoctorRegistered(msg.sender);
    }

    // Function for owner to verify a doctor
    function verifyDoctor(address _doctor) external onlyOwner {
        require(bytes(doctors[_doctor].name).length > 0, "Doctor not registered");
        doctors[_doctor].isVerified = true;
        doctors[_doctor].isActive = true;
        emit DoctorVerified(_doctor);
    }

    // Function for a patient to input their details
    function setPatientDetails(
        string memory _name,
        uint _age,
        string memory _city,
        bytes32 _medicalRecordsHash
    ) external {
        require(bytes(_name).length > 0 && bytes(_name).length <= 100, "Invalid name length");
        require(_age > 0 && _age < 150, "Invalid age");
        require(bytes(_city).length > 0 && bytes(_city).length <= 100, "Invalid city length");

        Patient storage patient = patients[msg.sender];
        patient.name = _name;
        patient.age = _age;
        patient.city = _city;
        patient.medicalRecordsHash = _medicalRecordsHash;
        patient.isRegistered = true;

        // Add the patient to the patient list
        patientList.push(msg.sender);

        emit PatientDetailsUpdated(msg.sender);
    }

    // Function for a patient to allow a doctor access
    function allowDoctorAccess(address _doctor) external onlyRegisteredPatient {
        require(doctors[_doctor].isVerified && doctors[_doctor].isActive, "Invalid or inactive doctor");
        require(!patients[msg.sender].isAllowedDoctor[_doctor], "Doctor already has access");

        patients[msg.sender].isAllowedDoctor[_doctor] = true;
        patients[msg.sender].allowedDoctors.push(_doctor);
        
        emit AccessGranted(msg.sender, _doctor);
    }

    // Function for a patient to revoke a doctor's access
    function revokeDoctorAccess(address _doctor) external onlyRegisteredPatient {
        require(patients[msg.sender].isAllowedDoctor[_doctor], "Doctor does not have access");
        
        patients[msg.sender].isAllowedDoctor[_doctor] = false;
        
        // Remove doctor from allowedDoctors array
        Patient storage patient = patients[msg.sender];
        for (uint i = 0; i < patient.allowedDoctors.length; i++) {
            if (patient.allowedDoctors[i] == _doctor) {
                patient.allowedDoctors[i] = patient.allowedDoctors[patient.allowedDoctors.length - 1];
                patient.allowedDoctors.pop();
                break;
            }
        }
        
        emit AccessRevoked(msg.sender, _doctor);
    }

    // Function for a doctor to view accessible patients
    function getAccessiblePatients() external view onlyVerifiedDoctor returns (
        address[] memory patientAddresses,
        string[] memory names,
        uint[] memory ages,
        string[] memory cities,
        bytes32[] memory recordHashes
    ) {
        uint count = 0;

        // Count the number of accessible patients
        for (uint i = 0; i < patientList.length; i++) {
            address patientAddr = patientList[i];
            if (patients[patientAddr].isRegistered && patients[patientAddr].isAllowedDoctor[msg.sender]) {
                count++;
            }
        }

        // Initialize arrays with the correct size
        patientAddresses = new address[](count);
        names = new string[](count);
        ages = new uint[](count);
        cities = new string[](count);
        recordHashes = new bytes32[](count);

        // Populate the arrays with the accessible patients' data
        uint index = 0;
        for (uint i = 0; i < patientList.length; i++) {
            address patientAddr = patientList[i];
            if (patients[patientAddr].isRegistered && patients[patientAddr].isAllowedDoctor[msg.sender]) {
                Patient storage patient = patients[patientAddr];
                patientAddresses[index] = patientAddr;
                names[index] = patient.name;
                ages[index] = patient.age;
                cities[index] = patient.city;
                recordHashes[index] = patient.medicalRecordsHash;
                index++;
            }
        }
    }

    // Function for a patient to get their own details
    function getPatientDetails() external view onlyRegisteredPatient returns (
        string memory name,
        uint age,
        string memory city,
        bytes32 medicalRecordsHash,
        address[] memory allowedDoctors
    ) {
        Patient storage patient = patients[msg.sender];
        return (
            patient.name,
            patient.age,
            patient.city,
            patient.medicalRecordsHash,
            patient.allowedDoctors
        );
    }

    // Function to check if a doctor has access to a specific patient
    function checkDoctorAccess(address _patient, address _doctor) external view returns (bool) {
        return patients[_patient].isAllowedDoctor[_doctor];
    }
}