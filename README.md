# Fabric set up
```shell
sudo apt update
sudo apt-get install git
sudo apt-get install curl
sudo apt install docker.io
sudo curl -L https://github.com/docker/compose/releases/download/1.28.5/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose  
sudo usermod -aG docker ${USER}
```
Close the ternimal and open again.
```shell
git clone https://github.com/MakTom/HyperLedger-Fabric-Supplychain
cd HyperLedger-Fabric-Supplychain/test-network
./network.sh up
```
# Supplychain Project
```shell
cd supplychain-Project/test-network
```

### 1. Adding Orgs 
```shell
./network.sh down
./network.sh up createChannel -ca -s couchdb
cd addOrg3
./addOrg3.sh up -c mychannel -ca -s couchdb
```
### 2. Generate org config
```shell
export FABRIC_CFG_PATH=$PWD
../../bin/configtxgen -printOrg Org3MSP > ../organizations/peerOrganizations/org3.example.com/org3.json
```
### 3. Starting docker container
```shell
docker-compose -f docker/docker-compose-org3.yaml up -d
cd ..
```
### 4. Deploy chain code
```shell
./network.sh deployCC -ccn SupplychainContract -ccp ../chaincode/ -ccl javascript -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')"
```
### 5. setting env variables
```shell
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```
### 6. Accessing CouchDB interface
  http://[YourExternalIP]:PORT/_utils           
  Username: admin               
  Password: adminpw   
    
  ![Couchdb]( https://i.postimg.cc/9XYSwyv4/Capture.png) 
### Initialize ChainCode
```shell
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n SupplychainContract --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt  --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt  --peerAddresses localhost:11051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt  -c '{"function":"InitLedger","Args":[]}'
```
## Interact with chain code
### CreateProduct
```shell
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n SupplychainContract -c '{"Args":["createProduct", "admin","Order002", "Orange", "160.00", "110", "farm1", "walmart"]}'
```
### AssignShipper
```shell
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n SupplychainContract -c '{"Args":["assignShipper","admin", "Order002", "Ship1"]}'
```
### CreateShipment
```shell
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n SupplychainContract -c '{"Args":["createShipment", "admin","Order002", "TrackingID1"]}'
```
### TransportShipment
```shell
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n SupplychainContract -c '{"Args":["transportShipment", "admin","Order002"]}'
```
### ReceiveShipment
```shell
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n SupplychainContract -c '{"Args":["receiveShipment", "admin","Order002"]}'
```
### Select by ID
```shell
peer chaincode query -C mychannel -n SupplychainContract -c '{"Args":["selectOrderByID","Order002"]}' | jq
```

### OrderHistory
```shell
peer chaincode query -C mychannel -n SupplychainContract -c '{"Args":["getOrderHistory","admin","Order002"]}' | jq
```

## To Run Server Side
```shell
cd HyperLedger-Fabric-Supplychain/serverside/api
node enrollAdmin.js org1 admin adminpw
node enrollAdmin.js org2 admin adminpw
node enrollAdmin.js org3 admin adminpw
npm start
```
## To Run Client Side

```shell
cd HyperLedger-Fabric-Supplychain/clientside/supplychain
npm start
```
### Login Admin in organization1
 ![admin-Org1](https://i.postimg.cc/MH6h9mKq/admin-Org1.png)
 ### Admin Screen
 ![admin-Screen]( https://i.postimg.cc/CMRtx5Bv/admin-Screen.png)
  ### Register Producer User
 ![Register-Producer]( https://i.postimg.cc/50Y3bH7L/Register-Producer.png)
  ### Login Admin in organization2
 ![admin-Org2]( https://i.postimg.cc/25qvBsQf/admin-Org2.png)
   ### Register Shipper User
 ![Register-Shipper]( https://i.postimg.cc/dtHLmWtQ/Register-Shipper.png)
   ### Login Admin in organization3
 ![admin-Org3]( https://i.postimg.cc/gjMksJpt/admin-Org3.png)
   ### Register Retailer User
 ![register-Retailer.]( https://i.postimg.cc/26rkfv8X/register-Retailer.png)
   ### Login Producer
 ![Login-Producer.]( https://i.postimg.cc/85pSYSt2/Login-Producer.png)
   ### Producer Screen
 ![Producer-Screen]( https://i.postimg.cc/x1LVTC7r/Producer-Screen.png)
   ### Create Product
 ![Create-Product]( https://i.postimg.cc/85P2HbCD/Create-Product.png)
   ### Assign Shipper
 ![Assign-Shipper]( https://i.postimg.cc/ZnW1kK3M/Assign-Shipper.png)
   ### Producer Order History
 ![Producer-Order-History]( https://i.postimg.cc/KvgdJjmK/Producer-Order-History.png)
   ### Login Shipper
 ![Login-Shipper]( https://i.postimg.cc/4dd0tN8x/Login-Shipper.png)
   ### Create Shipment
 ![Create-Shipment](  https://i.postimg.cc/D04Yjp3V/Create-Shipment.png)
   ### Transport Shipper
 ![Transport-Shipper]( https://i.postimg.cc/ZY9bzTTm/Transport-Shipper.png)
   ### Shipper View Order
 ![Shipper-View-Order]( https://i.postimg.cc/2Sxm7yxQ/Shipper-View-Order.png)
   ### Retailer Login
 ![Retailer-Login]( https://i.postimg.cc/CK1yCN50/Retailer-Login.png)
   ### Receive Shipper
 ![Receive-Shipper]( https://i.postimg.cc/L89GRTzP/Receive-Shipper.png)
   ### Retailer View Order
 ![Retailer-Order-View]( https://i.postimg.cc/rpvhdCtQ/Retailer-Order-View.png)

