# Requirements
## **1. Problem Statement:**
The Supply chain industry has been and still is being hampered by trust, efficiency, and transparency. A Blockchain system will support transparency, enhance trust, efficiency, and speed, by utilizing a decentralized ledger that is immutable for recording all transactions among multiple parties allowing verifiability in a tamper-proof way.
## **2. Goals:**
Create a ledger system that creates an eco-system where information flows openly in a permissioned manner, reduces the assumed risk in the supply chain, and reduces the total cost of the supply chain while making the supply chain more agile and adaptive.  
## **3. Stakeholders:**
### Participants:

- Retailer
  - Place an Order to a Producer
  - Receives Order from a Shipper
- Producer
  - Fulfills an Order
  -  Assigns to a Shipper
- Shipper
  - Creates shipment and transport Order assigned by Producer.
- Customer
  - Queries  an  Order  to  get  the  Order  Transaction  History,  tracing  it  back  to origination.
- Regulator
  - Moderates  all  Orders  in  the  system  to  ensure  that  proper  quality  and guidelines are being followed and Audit purposes.
## **4. Restrictions/Rules:**
 ![Restrictions](https://i.postimg.cc/jq80pjMq/Table.jpg)
## **5. Data:**
This defines data that is required for the chain code, information about each product (e.g., Product Id, Price, etc.) and transactions by all parties will be stored on the Hyperledger database CouchDB. 
## **6. Exceptions:**
An audit may need to be done and access may be needed in the case of a government investigation (E.g., Money laundering, illegal smuggling)
## **7. User Stories:**
This  sample  demonstrates  an  end-to-end  blockchain  application  that  connects  to  Hyperledger Fabric 2.2. It implements attribute-based access control, user management, and a React front-end UI  to  interact  and  query  the  blockchain  ledger.  The  sample  takes  the  user  through  ordering, shipping,  and  enlisting  the  product  for  the  customer.  The  customer  can  trace  the  order  history through  the  supply  chain,  providing  end-to-end  visibility.  For  example,  you  can  see  the  retailer receiving a shipment, and then a customer logging into the application to see a trace of when the shipment  was  ordered,  shipped,  and  received.  Lastly,  a  regulator  has  access  to  all  orders  in  the system to ensure correct practices are followed.

# Architecture
## 1. Project Description:

 This project is designing a Supply Chain dApp (Decentralized Application) using the Hyperledger Fabric Blockchain framework, other technologies used are Nodejs which acts as a middleware technology in connecting frontend and backend (blockchain) to communicate together, React is used for developing the Web Application. The reason for Blockchain is to create a trustless, efficient, and transparent system that allows faster movement of products and transaction processing.
 
![ArchitectureDiagram](https://gateway.pinata.cloud/ipfs/QmNmfReDhdVrzTJnymXqs1DfHUeTedz2DTG2GQpj8fj4ov)
## **2. State diagram**

 ![StateDiagram](https://gateway.pinata.cloud/ipfs/QmWy6chZHjSPLuwWdBtzZxwfdP9vUDckVdVWYRyjudYNK9)
## **3. Data**

 ![Data](https://i.postimg.cc/zv7NdhbR/State-Data.jpg)

## **4. Functions - inputs/outputs**

 ![Data](https://i.postimg.cc/N0cNY1ST/Function.jpg)

## **5. Roles**

 ![Data](https://i.postimg.cc/5tgmVDwd/Access.jpg)
 
# Project Plan

 ![Project Plan](https://i.postimg.cc/Fz5bPd5m/Plan.jpg)
