pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

contract kyc{
    int eventFlag = -1;

    bool isSessionActive;

    address bankActiveAddress;

    string customerActive;

    struct Customer {
        string userName;
        string dataHash;
        address ethAdd;
        string password;
        string verifiedBy;
    }

    struct Bank {
        string name;
        string password;
        address ethAddress;
        uint256 totalKycCount;
    }

    struct Request {
        string userName;
        address bankAddress;
        string bankName;
        bool isAllowed;
        bool isResponded;
    }

    mapping(string => Customer) allCustomers;
    mapping(address => Bank) organisation;
    Request[] public allRequests;
    Request[] public returnRequests;

    function getEventFlag() public view returns (int)
    {
        return eventFlag;
    }

    function stringsEqual(string storage _a, string memory _b) internal view returns (bool)
    {
        bytes storage a = bytes(_a);
        bytes memory b = bytes(_b);
        if (a.length != b.length) return false;

        for (uint256 i = 0; i < a.length; i++) {
            if (a[i] != b[i]) return false;
        }
        return true;
    }

    function isPartOfOrg() public payable returns (bool) {
            if (organisation[msg.sender].ethAddress == msg.sender) return true; return false;
    }

    function getIsSessionActive() public view returns(bool)
    {
        return isSessionActive;
    }

    function getBankActiveAddress() public view returns (address)
    {
        return bankActiveAddress;
    }

    function setBankActiveAddress(address add) public payable returns (address)
    {
        bankActiveAddress = add;
    }

    function setActiveCustomer(string memory uName) public payable returns (address)
    {
        customerActive = uName;
    }
    
    function getActiveCustomer() public view returns (string memory)
    {
        return customerActive;
    }

    function getActiveBankName() public view returns (string memory)
    {
        return organisation[bankActiveAddress].name;
    }

    function getCustomerETHAdd(string memory uName) public view returns (address)
    {
        return allCustomers[uName].ethAdd;
    }

    function getRequests() public view returns (Request[] memory)
    {
        return returnRequests;
    }

    function addBank(string memory uname, string memory password, address eth)
        public
        payable
        returns (uint256)
    {
        eventFlag = -1;
        if(organisation[eth].ethAddress == msg.sender){
            eventFlag = 1;
            return 1;
        }
        organisation[eth] = Bank(uname, password, eth, 0);
        eventFlag = 0;
        return 0;
    }

    function checkBank(string memory Uname, string memory password, address addr) public payable returns(string memory) {
            if(stringsEqual(organisation[addr].password, password) && stringsEqual(organisation[addr].name, Uname) && organisation[addr].ethAddress == addr) {

                return "0";
            }
        return "-1";
    }

    function viewBank() public payable returns(string memory, uint)
    {
        return (organisation[bankActiveAddress].name, organisation[bankActiveAddress].totalKycCount);
    }


    function addCustomer(string memory Uname, string memory DataHash, string memory password, address add, string memory verifiedBy) public payable
    {
        eventFlag = -1;
        if (!isPartOfOrg()) eventFlag = 7;
        else if (stringsEqual(allCustomers[Uname].userName, Uname)) eventFlag = 2;

        else {
            allCustomers[Uname] = Customer(
            Uname,
            DataHash,
            add,
            password,
            verifiedBy
            );
            eventFlag = 0;
        }
        organisation[msg.sender].totalKycCount++;
        allRequests.push(Request(Uname, msg.sender, getActiveBankName(), true, true));
    }

    function getVerifiedBy(string memory uName) public payable returns(string memory) {
        return allCustomers[uName].verifiedBy;
    }

    function viewCustomer(string memory Uname) public payable returns(string memory) {
        return allCustomers[Uname].dataHash;
    }

    function verifyCustomer(string memory uName, string memory password) public payable returns(uint) {
        if(!stringsEqual(allCustomers[uName].password,password)){
            return 1;
        }
        if(stringsEqual(allCustomers[uName].password,password) && allCustomers[uName].ethAdd == msg.sender){
            return 2;
        }
        if(stringsEqual(allCustomers[uName].password,password) && allCustomers[uName].ethAdd != msg.sender)
        {
            return 3;
        }
        return 0;
    }

    function modifyCustomer(string memory Uname, string memory DataHash) public payable
    {
        eventFlag = -1;
        if (!isPartOfOrg()) eventFlag = 7;
        else {
            allCustomers[Uname].dataHash = DataHash;
            eventFlag = 0;
        }
    }

    function changePasswordCus(string memory uName, string memory password) public payable
    {
        allCustomers[uName].password = password;
    }

    function sendRequest(string memory uname, address bankAdd) public payable {
        eventFlag = -1;
        for(uint i = 0; i < allRequests.length; i++)
        {
            if(stringsEqual(allRequests[i].userName, uname) && allRequests[i].bankAddress == bankAdd && allRequests[i].isAllowed == true && allRequests[i].isResponded == true){
                eventFlag = 1;
                return;
            }

            if(stringsEqual(allRequests[i].userName, uname) && allRequests[i].bankAddress == bankAdd){
                allRequests[i].isAllowed = false;
                allRequests[i].isResponded = false;
                eventFlag = 2;
                return;
            }
        }

        allRequests.push(Request(uname, bankAdd,getActiveBankName(), false, false));
        eventFlag = 2;
    }

    function filterRequests() public payable
    {
        delete returnRequests;
        for(uint i = 0; i < allRequests.length; i++)
        {
            if(stringsEqual(allRequests[i].userName, customerActive) && allRequests[i].isResponded == false)
            {
                returnRequests.push(allRequests[i]);
            }
        }
    }

    function processRequest(string memory uname, address bankAdd, bool response) public payable{
        for(uint i = 0; i < allRequests.length; i++)
        {
            if(stringsEqual(allRequests[i].userName, uname) && allRequests[i].bankAddress == bankAdd){
                allRequests[i].isAllowed = response;
                allRequests[i].isResponded = true;
                break;
            }
        }
    }

    function isAllowed(string memory uname, address bankAdd) public payable returns(uint)
    {
        for(uint i = 0; i < allRequests.length; i++)
        {
            if(stringsEqual(allRequests[i].userName, uname) && allRequests[i].bankAddress == bankAdd && allRequests[i].isResponded == false) {
                return 1; //not yet responded
            }

            else if(stringsEqual(allRequests[i].userName, uname) && allRequests[i].bankAddress == bankAdd && allRequests[i].isResponded == true && allRequests[i].isAllowed == true){
                return 2; //allowed
            }

            else if(stringsEqual(allRequests[i].userName, uname) && allRequests[i].bankAddress == bankAdd && allRequests[i].isResponded == true && allRequests[i].isAllowed == false){
                return 3; //not allowed
            }
        }
        return 4; //no request sent
    }
}