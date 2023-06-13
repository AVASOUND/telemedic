//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// PUSH Comm Contract Interface
interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}


contract TeleAppointment is Ownable, ReentrancyGuard{

    uint public appointmentId;

    address public EPNS_COMM_ADDRESS = 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa;
    address public EPNS_CHANNEL_ADDRESS = 0x80E52056d7860A76FAc64212ab1254De4af24B81;



    enum AppointmentStatus {
        Scheduled,
        Confirmed,
        Completed,
        Cancelled
    }

    struct Doctor{
        string name;
        address wallet;
        uint chargesInUsd; //contains 2 decimals
        uint chargesInApe;   //contains 2 decimals
        string specialisation;
    }


    struct Appointment{
        address doctor;
        address patient;
        string doctorName;
        string patientName;
        AppointmentStatus status;
        uint time; // in uinx epoch time
        string currency;
        uint amount;

    }

    mapping(string => Doctor) public doctorList;
    mapping(address => mapping(string => uint)) public wallets;
    mapping(uint => Appointment) public appointments;
    mapping(string => IERC20) public currencies; // expected currencies USDC and APECOIN

    event NewDoctor (
        string indexed doctorname,
        address wallet,
        string indexed specialisation,
        uint chargesInUsd,
        uint chargesInApe
    );

    event NewAppointment (
        uint indexed appointmentId,
        address indexed patient,
        address indexed doctor,
        uint time,
        uint charges,
        string currency,
        string status
    );


    function addCurrencies( string memory _currency, address _tokenAddress) public onlyOwner {
        currencies[_currency] = IERC20(_tokenAddress);
    }

    function addDoctors( string memory _doctorName, address _walletAddress, uint _usdCharges, uint _apecoinCharges, string memory _specialisation) public onlyOwner {
        
        require(doctorList[_doctorName].wallet == address(0));
        doctorList[_doctorName] = Doctor(_doctorName, _walletAddress, _usdCharges,_apecoinCharges,_specialisation);
        
        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            EPNS_CHANNEL_ADDRESS, // from channel
            EPNS_CHANNEL_ADDRESS, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "1", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "New Doctor Added", // this is notificaiton title
                        "+", // segregator
                        "A new doctor ",
                        _doctorName,
                        " has been added to the Doctor's List"
                    )
                )
            )
        );
    
    }



    function bookAppointment(string memory _doctorName, string memory _patientName, uint _sessionsCount, uint _time, string memory _currencyOfPayment ) public {

        appointmentId++;
        require(doctorList[_doctorName].wallet != address(0), "Docotor is not in List");
        uint charges;
         if (keccak256(abi.encodePacked((_currencyOfPayment))) == keccak256(abi.encodePacked(('USD')))) {
            charges = doctorList[_doctorName].chargesInUsd * _sessionsCount * 10 ** 6;
         } else {
            charges = doctorList[_doctorName].chargesInApe * _sessionsCount * 10 ** 18;
         }
        appointments[appointmentId] = Appointment( doctorList[_doctorName].wallet, msg.sender, _doctorName, _patientName, AppointmentStatus.Scheduled, _time, _currencyOfPayment, charges);

        require(currencies[_currencyOfPayment].balanceOf(msg.sender) > charges, "Insufficient Balance");
        currencies[_currencyOfPayment].transferFrom(msg.sender, address(this), charges);

        emit NewAppointment(appointmentId, msg.sender, doctorList[_doctorName].wallet, _time, charges, _currencyOfPayment, "Scheduled");
        statusUpdates( appointmentId, _doctorName, _patientName, 'Scheduled', doctorList[_doctorName].wallet);
        
    }

    function updateAppointment( uint aId, AppointmentStatus _status) public { 

        require(msg.sender == appointments[aId].doctor || msg.sender == appointments[aId].patient);
        
        if (_status == AppointmentStatus.Confirmed) {

            require(msg.sender == appointments[aId].doctor);
            require(appointments[aId].status == AppointmentStatus.Scheduled);
            statusUpdates( aId,  appointments[aId].doctorName, appointments[aId].doctorName, 'Confirmed', appointments[aId].patient);
            


        }else if (_status == AppointmentStatus.Completed){
            require(appointments[aId].status == AppointmentStatus.Confirmed);
            wallets[appointments[aId].doctor][appointments[aId].currency] += appointments[aId].amount;
            statusUpdates( aId,  appointments[aId].doctorName, 'Admin', 'Completed', appointments[aId].patient);
            

        }else if (_status == AppointmentStatus.Cancelled){
            require(appointments[aId].status == AppointmentStatus.Confirmed || appointments[aId].status == AppointmentStatus.Scheduled );
            wallets[appointments[aId].patient][appointments[aId].currency] += appointments[aId].amount;
            statusUpdates( aId,  appointments[aId].doctorName, 'Admin', 'Cancelled', appointments[aId].patient);
            
        } else {
            require(appointments[aId].status == AppointmentStatus.Cancelled);
        }
        appointments[aId].status = _status;
    }

    function withdrawAmount(string memory _currency) public nonReentrant {
        require(wallets[msg.sender][_currency] > 0 , "Insufficient Balance");
        require(currencies[_currency].balanceOf(address(this)) >= wallets[msg.sender][_currency], "Insufficient Balance in contract");
        currencies[_currency].transfer( msg.sender, wallets[msg.sender][_currency]);
        wallets[msg.sender][_currency] = 0;

    }


    function statusUpdates( uint _appointmentId, string memory _doctorName, string memory _user, string memory _status, address _reciever) public {

        string memory appointmentId_ = Strings.toString(_appointmentId);
        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            EPNS_CHANNEL_ADDRESS, // from channel
            _reciever, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "Appointment Update", // this is notificaiton title
                        "+", // segregator
                        "The Appointment ",
                        appointmentId_,
                        " with Dr.", // notification body
                        _doctorName,
                        " has been ",
                        _status ,
                        " by ",
                        _user, // notification body
                        "."
                        
                    )
                )
            )
        );
    }
}