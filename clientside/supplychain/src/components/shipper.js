import React, { useState}  from "react";
import axios from 'axios';
import {  Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Shipper(props){

    const [currentctx, setcurrentctx] = useState('none');
    const [orderId, setorderId] = useState();
    const [trackingId, settrackingId] = useState();
    const [Result, setResult] = useState([]);
    const [isloading, setIsLoading] = useState(false);

    function handleCreate(e) {
        e.preventDefault();
        setIsLoading(true);

        axios({
            method: 'post',
            url: 'http://34.124.116.30:8080/orders/createshipment',
            data: {
                ogname: props.UserOrg,
                username: props.User,
                userrole: props.UserRole,
                orderId: orderId,
                trackingId: trackingId
            }
        }).then((response) => {
            setIsLoading(false);
            alert(response.data.message);
            setorderId('');
            settrackingId('');
            
        });
    }


    function handleShipment(e) {
        e.preventDefault();
        setIsLoading(true);

        axios({
            method: 'post',
            url: 'http://34.124.116.30:8080/orders/transportshipment',
            data: {
                ogname: props.UserOrg,
                username: props.User,
                userrole: props.UserRole,
                orderId: orderId
            }
        }).then((response) => {
            setIsLoading(false);
            console.log(response.data);
            alert(response.data.message);
            setorderId('');
            
        });
    }
    function handleView(e) {
        e.preventDefault();
        setIsLoading(true);

        axios.get('http://34.124.116.30:8080/orders/history', {
            params: {
                ogname: props.UserOrg,
                username: props.User,
                userrole: props.UserRole,
                orderId: orderId
            }
        }).then((response) => {
            setIsLoading(false);
            Result.length=0;
            if(response.data.length > 0)
                setcurrentctx('View list');
            for (let i = 0; i < response.data.length; i++) {
                Result.push(response.data[i]);
            }
            setorderId('');
        });
    }

    return(
        <div >
            <button className="button" onClick={() => setcurrentctx('Create Shipment') }>Create Shipment</button>
            <button className="button" onClick={() => setcurrentctx('Transport Shipment') }>Transport Shipper</button>
            <button className="button" onClick={() => setcurrentctx('View Order') }>View Order</button>
            {isloading && 
                <Spinner animation="border" role="status" variant="light">
                </Spinner>
            } 
            <div>
                { currentctx === 'Create Shipment' && 
                    <form onSubmit={handleCreate}>
                        <div className="input-container-submit">
                            <label> Order ID</label>
                            <input className="input-box"  type="text"  value ={orderId} required onChange={(e) => setorderId(e.target.value)}/> 
                        </div>
                        <div className="input-container-submit">
                            <label>Tracking ID</label>
                            <input className="input-box"  type="text"  value ={trackingId} required onChange={(e) => settrackingId(e.target.value)}/> 
                        </div>
                        <input className="submit-button" type="submit" value="Submit" />
                    </form>
                }
            </div>
            <div>
                { currentctx === 'Transport Shipment' && 
                    <form onSubmit={handleShipment}>
                         <div className="input-container-submit">
                            <label> Order ID</label>
                            <input className="input-box"  type="text" required  value ={orderId} onChange={(e) => setorderId(e.target.value)}/>
                        </div>
                        <input className="submit-button" type="submit" value="Submit" />
                    </form>
                }

            </div>
            <div>
                { currentctx === 'View Order' && 
                    <form onSubmit={handleView}>
                        <div className="input-container-submit">
                            <label> Order ID</label>
                            <input className="input-box"  type="text" required onChange={(e) => setorderId(e.target.value)}/>
                        </div>
                        <input className="submit-button" type="submit" value="Submit" />
                    </form>
                }
                { currentctx === 'View list' && 
                <div >
                    <br></br>
                    <table className="order-list">
                        <thead>
                            <tr className="order-list-header">
                                <th>Order ID</th>
                                <th>Status</th>
                                <th>Product ID</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Producer ID</th>
                                <th>Shipper ID</th>
                                <th>Tracking Info</th>
                                <th>Retailer ID</th>
                                <th>Modified By</th>
                                <th>TimeStamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            { 
                                Result.map((item) => (
                                    <tr key={item.Value.ID}>
                                        <td>{item.Value.ID}</td>
                                        <td>{item.Value.currentState}</td>
                                        <td>{item.Value.productId}</td>
                                        <td>{item.Value.quantity}</td>
                                        <td>{item.Value.price}</td>
                                        <td>{item.Value.producerId}</td>
                                        <td>{item.Value.shipperId}</td>
                                        <td>{item.Value.trackingInfo}</td>
                                        <td>{item.Value.retailerId}</td>
                                        <td>{item.Value.modifiedBy}</td>
                                        <td>{item.Timestamp}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            }
            </div>
        </div>

    )
}

export default Shipper;