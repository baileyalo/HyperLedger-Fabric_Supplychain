/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {


         // console.log(process.argv[2]);
        // console.log(process.argv[2]);
        const ogname = process.argv[2];
        const uname = process.argv[3];
        const pswd = process.argv[4];
        const userrole = process.argv[5];
        const orgname = ogname+'.example.com';
       // console.log(orgname);
       const connectionname = 'connection-'+ogname+'.json';
       // console.log(connectionname);
        const canname = 'ca.'+ogname+'.example.com';
       // console.log(canname);
        const msp = ogname.replace('o','O')+'MSP';
        const affliatename = ogname+'.department1';
     
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', orgname, connectionname);
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
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        console.log('Run the enrollAdmin.js application before retrying');
        return;
    }
    console.log("test5");
    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    console.log("test6");
    // Register the user, enroll the user, and import the new identity into the wallet.
  
    const secret = await ca.register({ 
        //affiliation: affliatename,
        enrollmentID: uname, 
        role: 'client',
        attrs: [{ name: "role", value: userrole, ecert: true },
        { name: "pswd", value: pswd, ecert: true }] }, adminUser);

        console.log("test7");
    const enrollment = await ca.enroll({
        enrollmentID: uname,
        enrollmentSecret: secret
    });
    console.log("test8");
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: msp,
        type: 'X.509',
    };
    console.log("test9");
    await wallet.put(uname, x509Identity);
    console.log('Successfully registered and enrolled admin user "appUser" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "admin": ${error}`);
        process.exit(1);
    }
}

main();
