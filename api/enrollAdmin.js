/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration

        // print process.argv
        process.argv.forEach(function (val, index, array) {
            console.log(index + ': ' + val);

        });
        // console.log(process.argv[2]);
        // console.log(process.argv[2]);
         const ogname = process.argv[2];
         const uname = process.argv[3];
         const pswd = process.argv[4];
         const orgname = ogname+'.example.com';
        const connectionname = 'connection-'+ogname+'.json';
        // console.log(connectionname);
         const canname = 'ca.'+ogname+'.example.com';
        // console.log(canname);
         const msp = ogname.replace('o','O')+'MSP';
         


        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', orgname, connectionname);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities[canname];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet',ogname);

        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the  user.
        const identity = await wallet.get(uname);
        if (identity) {
            console.log(`An identity for the ${uname} user "${uname}" already exists in the wallet`);
            return;
        }
        console.log('Test1');
        // Enroll the user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: uname, enrollmentSecret: pswd });
        console.log('Test2');
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: msp,
            type: 'X.509',
        };
        console.log('Test3');
        await wallet.put(uname, x509Identity);
        console.log(`Successfully enrolled ${uname} user "${uname}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to enroll user ": ${error}`);
        process.exit(1);
    }
}

main();
