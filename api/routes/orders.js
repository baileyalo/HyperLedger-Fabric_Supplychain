var express = require('express');
var router = express.Router();
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function connectFabric(ogname, userid){

    const orgname = ogname+'.example.com';
    const connectionname = 'connection-'+ogname+'.json';

    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', orgname, connectionname);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet',ogname);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const userExists = await wallet.get(userid);
    if (!userExists) {
        return false;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userid, discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('SupplychainContract');
    return contract;
}

router.post('/create', async function(req, res) {

    try {
        // load the network configuration
        console.log("Test 1"+req.body.ogname);
        const contract = await connectFabric(req.body.ogname,req.body.username);
        if(!contract){
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
        }
        const result = await contract.submitTransaction('createProduct',req.body.username, req.body.orderId, req.body.productId, req.body.price, req.body.quantity, req.body.producerId, req.body.retailerId);
        res.json(JSON.parse(result.toString()));
  
        await gateway.disconnect();
    } catch (err) {
    }

});

router.post('/assign', async function(req, res) {

    try {
        // load the network configuration
        const contract = await connectFabric(req.body.ogname,req.body.username);
        if(!contract){
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
        }
        const result = await contract.submitTransaction('assignShipper',req.body.username, req.body.orderId, req.body.shipperId);
        res.json(JSON.parse(result.toString()));

        await gateway.disconnect();
    } catch (err) {

    }

});

router.get('/history', async function(req, res) {

    try {
        // load the network configuration
        const contract = await connectFabric(req.query.ogname,req.query.username);
        if(!contract){
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
        }
        const result = await contract.evaluateTransaction('getOrderHistory', req.query.username,req.query.orderId);
        res.json(JSON.parse(result.toString()));

        await gateway.disconnect();
    } catch (err) {

    }

});

router.post('/createshipment', async function(req, res) {

    try {
        const contract = await connectFabric(req.body.ogname,req.body.username);
        if(!contract){
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
        }
        const result = await contract.submitTransaction('createShipment',req.body.username, req.body.orderId,req.body.trackingId);
        res.json(JSON.parse(result.toString()));
        await gateway.disconnect();
    } catch (err) {

    }

});

router.post('/transportshipment', async function(req, res) {

    try {
        const contract = await connectFabric(req.body.ogname,req.body.username);
        if(!contract){
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
        }
        const result = await contract.submitTransaction('transportShipment',req.body.username,req.body.orderId);
        res.json(JSON.parse(result.toString()));
        await gateway.disconnect();
    } catch (err) {

    }

});

router.post('/receiveshipment', async function(req, res) {

    try {
        const contract = await connectFabric(req.body.ogname,req.body.username);
        if(!contract){
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
        }
        const result = await contract.submitTransaction('receiveShipment',req.body.username, req.body.orderId);
        res.json(JSON.parse(result.toString()));
        await gateway.disconnect();
    } catch (err) {

    }

});

module.exports = router;
