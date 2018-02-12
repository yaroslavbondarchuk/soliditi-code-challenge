pragma solidity ^0.4.2;

import "./usingOraclize.sol";

contract CodeChallenge is usingOraclize {
    //Constants
    string constant conditionQuery = "json(http://test-blockchain.getsandbox.com/state).state";
    string constant queryType = "URL";
    string constant enabledState = "true";
    uint256 constant signingContractDelayInSeconds = 5;

    // Custom types
    struct SignContractRequest {
        address from;
        uint256 amount;
        bool initialized;
    }
    struct TransferRequest {
        address from;
        address to;
        uint256 amount;
        bool initialized;
    }

    // State variables
    address public owner;
    address[] public signed;

    mapping(bytes32 => SignContractRequest) private signingQueue;
    mapping(bytes32 => TransferRequest) private transfersQueue;

    //Events
    event ContractSignEvent(string state);
    event TransferEvent(string state);

    function CodeChallenge() public payable {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function executeTransfer(address to) public payable {
        require(this.balance >= oraclize_getPrice(queryType));

        bytes32 queryId = oraclize_query(queryType, conditionQuery);
        transfersQueue[queryId] = TransferRequest(msg.sender, to, msg.value, true);
    }

    function signContract() payable {
        require(this.balance >= (oraclize_getPrice(queryType)) );

        bytes32 queryId = oraclize_query(signingContractDelayInSeconds, queryType, conditionQuery);
        signingQueue[queryId] = SignContractRequest(msg.sender, msg.value, true);
    }

    //oraclize callback
    function __callback(bytes32 queryId, string result) {
        require(msg.sender == oraclize_cbAddress());

        tryExecuteTransfer(queryId, result);
        trySignContract(queryId, result);
    }

    function tryExecuteTransfer (bytes32 queryId, string result) payable public {
        TransferRequest transferRequest = transfersQueue[queryId];
        if (transferRequest.initialized) {
            if (keccak256(enabledState) == keccak256(result)) {
                transferRequest.to.transfer(transferRequest.amount);
                TransferEvent("succeed");
            } else {
                //refund because condition is "false"
                transferRequest.from.transfer(transferRequest.amount);
                TransferEvent("failed");
            }
            //clean up
            delete transfersQueue[queryId];
        }
    }

    function trySignContract (bytes32 queryId, string result) payable public {
        SignContractRequest signContractRequest = signingQueue[queryId];
        if (signContractRequest.initialized) {
            if (keccak256(enabledState) == keccak256(result)) {
                signed.push(signContractRequest.from);
                ContractSignEvent("succeed");
            } else {
                //refund because condition is "false"
                signContractRequest.from.transfer(signContractRequest.amount);
                ContractSignEvent("failed");
            }
            //clean up
            delete signingQueue[queryId];
        }
    }

    // kill the smart contract
    function kill() restricted {
        selfdestruct(owner);
    }
}