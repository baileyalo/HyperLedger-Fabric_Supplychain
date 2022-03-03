var express = require('express');
var router = express.Router();
const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

router.get('/login', async function(req, res) {
 
    try {
        const orgname = req.query.organization+'.example.com';
        const connectionname = 'connection-'+req.query.organization+'.json';
    
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..','..', 'test-network', 'organizations', 'peerOrganizations', orgname, connectionname);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet',req.query.organization);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const userExists = await wallet.get(req.query.username);
        if (!userExists) {
            res.json({status: false, error: {message: 'User not exist in the wallet!! Please try again'}});
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.query.username, discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('SupplychainContract');
        const result = await contract.submitTransaction('getUser',req.query.username, req.query.password);
        res.json(JSON.parse(result.toString()));
        gateway.disconnect();
    } catch (err) {
            res.json({status: false, error: err});
    }

});

router.post('/enroll&register', async function(req, res) {

   try {

     //Should be like org1 in small letters
    const ogname = req.body.organization;
    const uname = req.body.username;
    const userrole = req.body.role;
    const orgname = ogname+'.example.com';
    const connectionname = 'connection-'+ogname+'.json';
    const canname = 'ca.'+ogname+'.example.com';
    const msp = ogname.replace('o','O')+'MSP';
    const affliatename = ogname+'.department2';
    

    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..','..', 'test-network', 'organizations', 'peerOrganizations', orgname, connectionname);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities[canname].url;
    const ca = new FabricCAServices(caURL);
    
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet',ogname);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    
    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(uname);
 
    if (userIdentity) {
        res.json({status: false, error: {message: 'User already Registered in the wallet'}});
        return;
    }
    
    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        res.json({status: false, error: {message: 'An identity for the admin user "admin" does not exist in the wallet'}});
        return;
    }
    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    // Register the user, enroll the user, and import the new identity into the wallet.
  
    const secret = await ca.register({ 
        //affiliation: affliatename,
        enrollmentID: uname, 
        role: 'client',
        attrs: [{ name: "role", value: userrole, ecert: true },
        { name: "pswd", value: req.body.password, ecert: true }] }, adminUser);

 
    const enrollment = await ca.enroll({
        enrollmentID: uname,
        enrollmentSecret: secret
    });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: msp,
        type: 'X.509',
    };
    await wallet.put(uname, x509Identity);
    res.json({status: true, message: 'Registeration Successfull'});
    return;

   } catch (error) {

        res.json({status: false, error: {message: `Failed to register user "admin": ${error}`}});
        process.exit(1);
   }
});

module.exports = router;
