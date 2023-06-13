// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "./PatientRecord.sol";
import "./RecordAccessToken.sol";

contract TokenGate is Ownable , ReentrancyGuard {

    PatientRecord public PRT;
    RecordAccessToken public RAT;

    uint patientId ;
    uint webinarId = 10 ** 13;

    struct PatientDetails {
        string fname;
        string sName;
        address wallet;
    }

    struct Token {
        IERC20 tokenAddress;
        uint decimals;
    }

    struct WebinarDetails {
        string topic;
        string presenter;
        uint time;
        string currency;
        uint cost;
    }



    mapping (uint => PatientDetails ) public patients;
    mapping ( address => uint) public walletIdMap;
    mapping (string => Token) public tokens;
    mapping( uint => WebinarDetails) public webinars;
    mapping( address => mapping( string => uint)) public balance;

    function addPatientRecordTokenAddress (address _contractAddress) public onlyOwner {
        PRT = PatientRecord(_contractAddress);
    }

    function addRecordAccessTokenAddress( address _contractAddress) public onlyOwner {
        RAT = RecordAccessToken(_contractAddress);
    }

    
    function addCurrencies( string memory _currency, address _tokenAddress, uint decimals) public onlyOwner {
        tokens[_currency] = Token(IERC20(_tokenAddress), decimals);
        
    }

    function addPatient(string memory _fname, string memory _lname, address _wallet )public onlyOwner {
        patientId ++;
        patients[patientId] = PatientDetails(_fname, _lname, _wallet);
        walletIdMap[_wallet] = patientId;

    }

    function mintPatientDiagnosis (uint _patientId , uint _appointmentId , string memory _uriOfDiagnosis) public onlyOwner {
        require(patients[_patientId].wallet != address(0), "Invalid Patient Id");
        PRT.safeMint(patients[_patientId].wallet, _appointmentId, _uriOfDiagnosis);
        RAT.mint(patients[_patientId].wallet, _appointmentId, 1, '0x00');

    }

    function shareDiagnosis(address _to, uint _tokenId) public {
        require(PRT.ownerOf(_tokenId) == msg.sender);
        RAT.mint(_to, _tokenId, 1, '0x00');
    }

    function newWebinar(string memory _topic, string memory _presenter, uint _time, string memory _currency, uint _amount ) public onlyOwner {
        
        webinarId++;
        webinars[webinarId] = WebinarDetails( _topic, _presenter, _time, _currency, _amount);
        PRT.safeMint(address(this), webinarId, "");

    }

    function enrolWebinar(uint _webinarId) public {
        require(walletIdMap[msg.sender] != 0, "Patient Need to register");
        require(webinars[_webinarId].time != 0, " Check Webinar Id");
        string memory currency = webinars[webinarId].currency;
        IERC20 tokenContract_ = tokens[currency].tokenAddress;

        uint charges = webinars[webinarId].cost * 10 **  tokens[currency].decimals;
        require(tokenContract_.balanceOf(msg.sender) > charges, "Insufficient Balance");
        tokenContract_.transferFrom(msg.sender, address(this), charges);
        balance[address(this)][currency] = charges;

        RAT.mint(msg.sender , _webinarId, 1, '0x00');
    }

    function updateTokenURI( uint tokenId, string memory URI) public onlyOwner {
        PRT.setTokenURI(tokenId, URI);
    }

    function withdrawFromContract( string memory _currency ) public onlyOwner {

        IERC20 tokenContract_ = tokens[_currency].tokenAddress;
        require(tokenContract_.balanceOf(address(this)) > 0, "Insufficient Balance");
        tokenContract_.transfer(msg.sender,  balance[address(this)][_currency]);
        balance[address(this)][_currency]=0;

    }

    


}