// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    struct DID {
        string documentHash;
        address owner;
    }

    mapping(string => DID) public dids;

    event DIDCreated(string did, string documentHash, address owner);

    function registerDID(string memory did, string memory documentHash) public {
        require(dids[did].owner == address(0), "DID already registered");
        dids[did] = DID(documentHash, msg.sender);
        emit DIDCreated(did, documentHash, msg.sender);
    }

    function getDID(string memory did) public view returns (string memory, address) {
        return (dids[did].documentHash, dids[did].owner);
    }
}
