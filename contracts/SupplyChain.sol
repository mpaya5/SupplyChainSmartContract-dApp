// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    uint32 public productIdCounter;
    uint32 public participantIdCounter;
    uint32 public ownershipIdCounter;

    struct Product {
        string modelNumber;
        string partNumber;
        string serialNumber;
        address productOwner;
        uint32 cost;
        uint32 mfgTimeStamp;
    }

    mapping(uint32 => Product) public products;

    struct Participant {
        string userName;
        string password;
        string participantType;
        address participantAddress;
    }

    mapping(uint32 => Participant) public participants;

    struct Ownership {
        uint32 productId;
        uint32 ownerId;
        uint32 trxTimeStamp;
        address productOwner;
    }

    mapping(uint32 => Ownership) public ownerships;
    mapping(uint32 => uint32[]) public productTrack;

    event TransferOwnership(uint32 indexed productId);

    function addParticipant(
        string memory name,
        string memory password,
        address participantAddress,
        string memory participantType
    ) public returns (uint32) {
        uint32 userId = participantIdCounter++;
        participants[userId] = Participant({
            userName: name,
            password: password,
            participantAddress: participantAddress,
            participantType: participantType
        });
        return userId;
    }

    function getParticipant(
        uint32 participantId
    ) public view returns (string memory, address, string memory) {
        Participant memory participant = participants[participantId];
        return (
            participant.userName,
            participant.participantAddress,
            participant.participantType
        );
    }

    function addProduct(
        uint32 ownerId,
        string memory modelNumber,
        string memory partNumber,
        string memory serialNumber,
        uint32 productCost
    ) public returns (uint32) {
        if (
            keccak256(bytes(participants[ownerId].participantType)) ==
            keccak256(bytes("Manufacturer"))
        ) {
            uint32 newProductId = productIdCounter++;
            products[newProductId] = Product({
                modelNumber: modelNumber,
                partNumber: partNumber,
                serialNumber: serialNumber,
                cost: productCost,
                productOwner: participants[ownerId].participantAddress,
                mfgTimeStamp: uint32(block.timestamp)
            });
            return newProductId;
        }
        return 0;
    }

    modifier onlyOwner(uint32 productId) {
        require(
            msg.sender == products[productId].productOwner,
            "Caller is not the current product owner"
        );
        _;
    }

    function getProduct(
        uint32 productId
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint32,
            address,
            uint32
        )
    {
        Product memory product = products[productId];
        return (
            product.modelNumber,
            product.partNumber,
            product.serialNumber,
            product.cost,
            product.productOwner,
            product.mfgTimeStamp
        );
    }

    function newOwner(
        uint32 fromParticipantId,
        uint32 toParticipantId,
        uint32 productId
    ) public onlyOwner(productId) returns (bool) {
        Participant memory fromParticipant = participants[fromParticipantId];
        Participant memory toParticipant = participants[toParticipantId];
        uint32 ownershipId = ownershipIdCounter++;

        bytes32 fromType = keccak256(bytes(fromParticipant.participantType));
        bytes32 toType = keccak256(bytes(toParticipant.participantType));

        bool validTransfer =
            (fromType == keccak256(bytes("Manufacturer")) &&
                toType == keccak256(bytes("Supplier"))) ||
            (fromType == keccak256(bytes("Supplier")) &&
                toType == keccak256(bytes("Supplier"))) ||
            (fromType == keccak256(bytes("Supplier")) &&
                toType == keccak256(bytes("Consumer")));

        if (!validTransfer) {
            return false;
        }

        ownerships[ownershipId] = Ownership({
            productId: productId,
            productOwner: toParticipant.participantAddress,
            ownerId: toParticipantId,
            trxTimeStamp: uint32(block.timestamp)
        });
        products[productId].productOwner = toParticipant.participantAddress;
        productTrack[productId].push(ownershipId);
        emit TransferOwnership(productId);
        return true;
    }

    function getProvenance(
        uint32 productId
    ) external view returns (uint32[] memory) {
        return productTrack[productId];
    }

    function getOwnership(
        uint32 ownershipId
    ) public view returns (uint32, uint32, address, uint32) {
        Ownership memory record = ownerships[ownershipId];
        return (
            record.productId,
            record.ownerId,
            record.productOwner,
            record.trxTimeStamp
        );
    }

    function authenticateParticipant(
        uint32 participantId,
        string memory userName,
        string memory password,
        string memory participantType
    ) public view returns (bool) {
        Participant memory participant = participants[participantId];
        return
            keccak256(bytes(participant.participantType)) ==
            keccak256(bytes(participantType)) &&
            keccak256(bytes(participant.userName)) ==
            keccak256(bytes(userName)) &&
            keccak256(bytes(participant.password)) ==
            keccak256(bytes(password));
    }
}
