// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ECDSAServiceManagerBase} from "@eigenlayer-middleware/src/unaudited/ECDSAServiceManagerBase.sol";
import {ECDSAStakeRegistry} from "@eigenlayer-middleware/src/unaudited/ECDSAStakeRegistry.sol";
import {IServiceManager} from "@eigenlayer-middleware/src/interfaces/IServiceManager.sol";
import {ECDSAUpgradeable} from "@openzeppelin-upgrades/contracts/utils/cryptography/ECDSAUpgradeable.sol";
import {IERC1271Upgradeable} from "@openzeppelin-upgrades/contracts/interfaces/IERC1271Upgradeable.sol";

contract PortfolioValidationServiceManager is ECDSAServiceManagerBase {
    using ECDSAUpgradeable for bytes32;

    enum TaskStatus { Active, Completed, Failed }
    enum ValidationStrategy { TokenEligibility, PortfolioBalance, RiskAssessment, YieldOptimization }

    struct PortfolioTask {
        address[] tokens;
        uint256[] amounts;
        ValidationStrategy strategy;
        TaskStatus status;
        uint256 createdAt;
        uint32 responses;
        bytes32 taskHash;
        mapping(address => bytes) operatorResponses;
    }

    struct TokenData {
        string chain;
        address tokenAddress;
        uint32 createdBlock;
        bool isEligible;
        string metadata;
    }

    uint32 public currentTaskId;
    mapping(uint32 => PortfolioTask) public tasks;
    mapping(uint32 => TokenData) public tokenRegistry;
    
    event NewPortfolioTask(
        uint32 indexed taskId,
        address[] tokens,
        uint256[] amounts,
        ValidationStrategy strategy
    );

    event ValidationSubmitted(
        uint32 indexed taskId,
        address indexed operator,
        bytes validation
    );

    event TokenDataUpdated(
        uint32 indexed tokenId,
        string chain,
        address tokenAddress,
        bool isEligible,
        string metadata
    );
    
    modifier onlyOperator() {
        require(isRegisteredOperator(msg.sender), "Not an operator");
        _;
    }
    
    constructor(
        address _avsDirectory,
        address _stakeRegistry,
        address _rewardsCoordinator,
        address _delegationManager
    ) ECDSAServiceManagerBase(
        _avsDirectory,
        _stakeRegistry,
        _rewardsCoordinator,
        _delegationManager
    ) {}

    function createPortfolioTask(
        address[] memory tokens,
        uint256[] memory amounts,
        ValidationStrategy strategy
    ) external returns (uint32) {
        require(tokens.length == amounts.length, "Invalid input lengths");
        
        uint32 taskId = currentTaskId++;
        
        PortfolioTask storage task = tasks[taskId];
        task.tokens = tokens;
        task.amounts = amounts;
        task.strategy = strategy;
        task.status = TaskStatus.Active;
        task.createdAt = block.timestamp;
        task.taskHash = keccak256(abi.encode(tokens, amounts, strategy));

        emit NewPortfolioTask(taskId, tokens, amounts, strategy);
        return taskId;
    }

    function submitValidation(
        uint32 taskId,
        bytes memory validation,
        bytes memory signature
    ) external {
        require(tasks[taskId].status == TaskStatus.Active, "Task not active");
        require(isRegisteredOperator(msg.sender), "Not registered operator");
        
        bytes32 messageHash = keccak256(abi.encodePacked(taskId, validation));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        require(
            verifyOperatorSignature(msg.sender, ethSignedMessageHash, signature),
            "Invalid signature"
        );

        tasks[taskId].operatorResponses[msg.sender] = validation;
        tasks[taskId].responses++;

        emit ValidationSubmitted(taskId, msg.sender, validation);
    }

    function getTaskValidations(uint32 taskId) external view returns (
        address[] memory operators,
        bytes[] memory validations
    ) {
        uint32 responseCount = tasks[taskId].responses;
        operators = new address[](responseCount);
        validations = new bytes[](responseCount);
        
        uint32 index = 0;
        for (uint32 i = 0; i < responseCount; i++) {
            address operator = address(uint160(i));
            bytes memory validation = tasks[taskId].operatorResponses[operator];
            if (validation.length > 0) {
                operators[index] = operator;
                validations[index] = validation;
                index++;
            }
        }
        return (operators, validations);
    }

    function completeTask(uint32 taskId, bool isSuccess) external onlyOperator {
        require(tasks[taskId].status == TaskStatus.Active, "Task is not active");
        tasks[taskId].status = isSuccess ? TaskStatus.Completed : TaskStatus.Failed;
    }

    function updateTokenData(
        uint32 tokenId,
        string memory chain,
        address tokenAddress,
        bool isEligible,
        string memory metadata
    ) external onlyOperator {
        TokenData storage token = tokenRegistry[tokenId];
        token.chain = chain;
        token.tokenAddress = tokenAddress;
        token.isEligible = isEligible;
        token.metadata = metadata;
        token.createdBlock = uint32(block.number);

        emit TokenDataUpdated(tokenId, chain, tokenAddress, isEligible, metadata);
    }
}
