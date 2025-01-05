// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientDoctorPortal {
    
    // Structure to hold patient details
    struct Patient {
        string name;
        uint age;
        string city;
        string medicalRecordsLink;
        address[] allowedDoctors;
    }

    // Mapping of patient address to their details
    mapping(address => Patient) private patients;

    // Mapping of doctor address to patients who granted access
    mapping(address => address[]) private doctorAccessList;

    // Event emitted when a patient allows a doctor to access their records
    event AccessGranted(address indexed patient, address indexed doctor);

    // Event emitted when a patient updates their details
    event PatientDetailsUpdated(address indexed patient);

    // Function for a patient to input their details
    function setPatientDetails(
        string memory _name,
        uint _age,
        string memory _city,
        string memory _medicalRecordsLink
    ) public {
        patients[msg.sender] = Patient({
            name: _name,
            age: _age,
            city: _city,
            medicalRecordsLink: _medicalRecordsLink,
            allowedDoctors: new address[](0)
        });
        emit PatientDetailsUpdated(msg.sender);
    }

    // Function for a patient to allow a doctor access to their records
    function allowDoctorAccess(address _doctor) public {
        require(bytes(patients[msg.sender].name).length > 0, "Patient details not found.");
        patients[msg.sender].allowedDoctors.push(_doctor);
        doctorAccessList[_doctor].push(msg.sender);
        emit AccessGranted(msg.sender, _doctor);
    }

    // Function for a doctor to view details of all patients who granted access
    function getAccessiblePatients() public view returns (Patient[] memory) {
        address[] memory patientAddresses = doctorAccessList[msg.sender];
        Patient[] memory accessiblePatients = new Patient[](patientAddresses.length);

        for (uint i = 0; i < patientAddresses.length; i++) {
            accessiblePatients[i] = patients[patientAddresses[i]];
        }
        return accessiblePatients;
    }

    // Function for a patient to get their own details
    function getPatientDetails() public view returns (
        string memory name,
        uint age,
        string memory city,
        string memory medicalRecordsLink,
        address[] memory allowedDoctors
    ) {
        Patient memory patient = patients[msg.sender];
        require(bytes(patient.name).length > 0, "Patient details not found.");
        return (
            patient.name,
            patient.age,
            patient.city,
            patient.medicalRecordsLink,
            patient.allowedDoctors
        );
    }
}
