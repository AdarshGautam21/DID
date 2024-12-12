const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { create } = require('ipfs-http-client');
const crypto = require('crypto');
const { ethers } = require('ethers');
const contractABI = require('./DIDRegistry.json'); // Replace with ABI
const contractAddress = '<Your_Contract_Address>';


const app = express();
const upload = multer({ dest: 'uploads/' });
const ipfs = create(); // Connect to local or remote IPFS node
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = provider.getSigner();
const didRegistry = new ethers.Contract(contractAddress, contractABI, signer);

async function registerDID(did, documentHash) {
    const tx = await didRegistry.registerDID(did, documentHash);
    await tx.wait();
    console.log('DID Registered:', did);
}


app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve HTML file

app.post('/api/create-did', upload.fields([{ name: 'aadhar' }, { name: 'passport' }]), async (req, res) => {
    try {
        const { aadhar, passport } = req.files;

        // Upload files to IPFS
        const aadharHash = (await ipfs.add(aadhar[0].buffer)).path;
        const passportHash = (await ipfs.add(passport[0].buffer)).path;

        // Generate DID Document
        const did = `did:ethr:${crypto.randomUUID()}`;
        const didDocument = {
            id: did,
            aadhar: aadharHash,
            passport: passportHash
        };

        // Store DID Document hash (temporary simulation)
        console.log('DID Document:', didDocument);

        res.json({ did, message: 'DID created successfully' });
    } catch (error) {
        console.error('Error creating DID:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
