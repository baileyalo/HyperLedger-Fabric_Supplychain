/*
 * Copyright IBM Corp. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;
const orderState = {
    ORDER_CREATED: 1,       // Producer
    SHIPMENT_ASSIGNED: 2,   // Producer
    SHIPMENT_CREATED: 3,    // Shipper
    SHIPMENT_IN_TRANSIT: 4, // Shipper
    SHIPMENT_RECEIVED: 5    // Retailer
};

class SupplychainContract extends Contract {

    // Init function
    async InitLedger(ctx) {
        console.info(`Chaincode Initialized`);
    }

    async toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    async selectOrderByID(ctx, id) {
        const orderJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!orderJSON || orderJSON.length === 0) {
            throw new Error(`The order ${id} does not exist`);
        }
        return orderJSON.toString();
    }

    async getUser(ctx, username, password) {
       
        if(username == 'admin' && password == 'adminpw'){
            return {status: true, user: username};
        }

        let cid = new ClientIdentity(ctx.stub); 
        if (cid.assertAttributeValue('pswd', password)) {
            return {status: true, user: username, role: cid.getAttributeValue('role')};
        }
        return {status: false, error: {message: 'Incorrect Password!! Please try again'}};
    }

    async createProduct(ctx,userid, orderId, productId,price,quantity,producerId,retailerId) {
      
        let cid = new ClientIdentity(ctx.stub); 
        let userType = "admin";
        if(userid != "admin"){
            userType = cid.getAttributeValue('role');
        }

        // Access Control: This transaction should only be invoked by a Producer or Admin
        if ((userType != "admin") && 
            (userType != "producer"))
            return {status: false, message: `This user ${userid} does not have access to create an order!!`};
        
        // Check if an order already exists with id=orderId
        var orderAsBytes = await ctx.stub.getState(orderId);
        if (orderAsBytes && orderAsBytes.length > 0) {
            return {status: false, message: `Order with orderId ${orderId} already exists!!`};
        }

        const order = {
            ID: orderId,
            productId: productId,
            price: price,
            quantity: quantity,
            producerId: producerId,
            retailerId: retailerId,
            currentState: orderState.ORDER_CREATED,
            modifiedBy:userid,

        };
        const result=await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));
        return {status: true,  result:result, message: `Order ${orderId} Successfully Created!!`};
               
    }

    async assignShipper(ctx,userid, orderId, newShipperId) {

        let cid = new ClientIdentity(ctx.stub); 
        let userType = "admin";
        if(userid != "admin"){
            userType = cid.getAttributeValue('role');
        }

        if (orderId.length < 1) {
            return {status: false, message: `OrderId is required as input!!`};
        }
        if (newShipperId.length < 1) {
            return {status: false, message: `ShipperId is required as input!!`};
        }

        //  Retrieve the current order using key provided
        var orderAsBytes = await ctx.stub.getState(orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            return {status: false, message: `Order with orderId ${orderId} does not exist!!`};
        }

        // Convert order so we can modify fields
        var order = JSON.parse( orderAsBytes );

        // Access Control: This transaction should only be invoked by designated Producer
       
        if ((userid != "admin") && 
            (userid != order.producerId))
            return {status: false, message: `${userid} does not have access to assign a shipper to order ${orderId}!!`};

        if (order.currentState != orderState.ORDER_CREATED)
        return {status: false, message: `${order.ID} is not in Order Created State!!`};

        // Change currentOrderState to SHIPMENT_ASSIGNED;
        order.currentState = orderState.SHIPMENT_ASSIGNED;
        order.shipperId = newShipperId;
        order.modifiedBy = userid;
        const result=await ctx.stub.putState(order.ID, Buffer.from(JSON.stringify(order)));
        return {status: true,  result:result, message: `Order ${orderId} Successfully Assigned to ${newShipperId}!!`};
    }

    async createShipment(ctx,userid, orderId, newTrackingInfo) {

        let cid = new ClientIdentity(ctx.stub); 
        let userType = "admin";
        if(userid != "admin"){
            userType = cid.getAttributeValue('role');
        }

        //  NOTE: There is no shipment asset.  A shipment is created for each order.
        //  Shipment is tracked using order asset.
        if (orderId.length < 1) {
            return {status: false, message: `OrderId is required as input!!`};
        }
        if (newTrackingInfo.length < 1) {
            return {status: false, message: `Tracking # is required as input!!`};
        }

        // Retrieve the current order using key provided
        var orderAsBytes = await ctx.stub.getState(orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            return {status: false, message: `Order with orderId = ${orderId} does not exist!!`};
        }

        // Convert order so we can modify fields
        // var order = Order.deserialize(orderAsBytes);
        var order = JSON.parse( orderAsBytes );

        // Access Control: This transaction should only be invoked by a designated Shipper
        // let userId = await this.getCurrentUserId(ctx);
        if ((userid != "admin") && // admin only has access as a precaution.
            (userid != order.shipperId))
            return {status: false, message: `${userid} does not have access to create a shipment for order ${orderId}!!`};

        if (order.currentState != orderState.SHIPMENT_ASSIGNED)
            return {status: false, message: `${order.ID} is not in Shipment Assigned State!!`};

        // Change currentOrderState to SHIPMENT_CREATED;
        order.currentState = orderState.SHIPMENT_CREATED;
        order.trackingInfo = newTrackingInfo;
        order.modifiedBy = userid;
        const result= await ctx.stub.putState(order.ID, Buffer.from(JSON.stringify(order)));
        return {status: true,  result:result, message: `Shipment successfully created for Order ${orderId}!!`};
    }

    async transportShipment(ctx,userid, orderId) {

        let cid = new ClientIdentity(ctx.stub); 
        let userType = "admin";
        if(userid != "admin"){
            userType = cid.getAttributeValue('role');
        }

        if (orderId.length < 1) {
            return {status: false, message: `OrderId is required as input!!`};
        }
        // Retrieve the current order using key provided
        var orderAsBytes = await ctx.stub.getState(orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            return {status: false, message: `Order with orderId = ${orderId} does not exist!!`};
        }
        var order = JSON.parse( orderAsBytes );
        // Access Control: This transaction should only be invoked by designated designated Shipper

        if ((userid != "admin")
            && (userid != order.shipperId)) 
            return {status: false, message: `${userid} does not have access to transport shipment for order ${orderId}!!`};
            
        if (order.currentState != orderState.SHIPMENT_CREATED)
            return {status: false, message: `${order.ID} is not in Shipment Created State!!`};
            
        // Change currentOrderState to SHIPMENT_IN_TRANSIT;
        order.currentState = orderState.SHIPMENT_IN_TRANSIT;
        order.modifiedBy = userid;
        const result = await ctx.stub.putState(order.ID, Buffer.from(JSON.stringify(order)));
        return {status: true,  result:result, message: `Shipment successfully transported for Order ${orderId}!!`};
    }

    async receiveShipment(ctx,userid, orderId) {

        let cid = new ClientIdentity(ctx.stub); 
        let userType = "admin";
        if(userid != "admin"){
            userType = cid.getAttributeValue('role');
        }
        if (orderId.length < 1) {
            return {status: false, message: `OrderId is required as input!!`};
        }
        var orderAsBytes = await ctx.stub.getState(orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            return {status: false, message: `Order with orderId = ${orderId} does not exist!!`};
        }

        var order = JSON.parse( orderAsBytes );
        // Access Control: This transaction should only be invoked by designated originating Retailer
   
        if ((userid != "admin") // admin only has access as a precaution.
            && (userid != order.retailerId)) // This transaction should only be invoked by
            return {status: false, message: `${userid} does not have access to receive shipment for order ${orderId}!!`};

        if (order.currentState != orderState.SHIPMENT_IN_TRANSIT)
            return {status: false, message: `${order.ID} is not in Shipment in Transit State!!`};
        // Change currentOrderState to SHIPMENT_RECEIVED;
        order.currentState = orderState.SHIPMENT_RECEIVED;
        order.modifiedBy = userid;
        const result = await ctx.stub.putState(order.ID, Buffer.from(JSON.stringify(order)));
        return {status: true,  result:result, message: `Shipment successfully received for Order ${orderId}!!`};
    }

    async getOrderHistory(ctx,userid, orderId) {

        let cid = new ClientIdentity(ctx.stub); 
        let userType = "admin";

        if(userid != "admin"){
            userType = cid.getAttributeValue('role');
        }

        console.info('============= getOrderHistory ===========');
        if (orderId.length < 1) {
            return {status: false, message: `OrderId is required as input!!`};
        }
        console.log("input, orderId = " + orderId);

        // Retrieve the current order using key provided
        var orderAsBytes = await ctx.stub.getState(orderId);

        if (!orderAsBytes || orderAsBytes.length === 0) {
            return {status: false, message: `Order with orderId = ${orderId} does not exist!!`};
        }

      
        var order = JSON.parse( orderAsBytes );
        // Access Control:
        if ((userid != "admin")             // admin only has access as a precaution.
            && (userType != "customer")      // Customers can see any order if it's in the correct state
            && (userType != "regulator")     // Regulators can see any order
            && (userid != order.producerId) // Only producer, retailer, shipper associated
            && (userid != order.retailerId) //      with this order can see its details
            && (userid != order.shipperId))
            return {status: false, message: `${userid} does not have access to order ${orderId}!!`};

        // Customer can only view order history if order has completed cycle
        if ((userType == "customer") && (order.currentState != OrderState.SHIPMENT_RECEIVED))
        return {status: false, message: `Information about order ${orderId} is not available to ${userid} yet. Order status needs to be SHIPMENT_RECEIVED!!`};

        console.info('start GetHistoryForOrder: %s', orderId);

        // Get list of transactions for order
        const iterator = await ctx.stub.getHistoryForKey(orderId);
        const orderHistory = [];
        console.info('iterator', iterator);
        
        while (true) {
            let history = await iterator.next();
            console.info('History', history);

            if (history.value && history.value.value.toString()) {
                 let jsonRes = {};
                 jsonRes.TxId = history.value.tx_id;
                 
                 var d = new Date(0);
                 d.setUTCSeconds(history.value.timestamp.seconds.low);
                 jsonRes.Timestamp = d.toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CST";
                // Store Order details
                try {
                    jsonRes.Value = JSON.parse(history.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Value = history.value.value.toString('utf8');
                }

                // Add to array of transaction history on order
                orderHistory.push(jsonRes);
            }

            if (history.done) {
                console.log('end of data');
                await iterator.close();
                console.info(orderHistory);
                return orderHistory;
            }
        }  

        
    }

}

module.exports = SupplychainContract;
