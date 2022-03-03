import React, { useState}  from "react";
import axios from 'axios';
import {  Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Producer(props){

    const [currentctx, setcurrentctx] = useState('none');
    const [orderId, setorderId] = useState();
    const [productId, setproductId] = useState();
    const [price, setprice] = useState();
    const [quantity, setquantity] = useState();
    const [producerId, setproducerId] = useState();
    const [retailerId, setretailerId] = useState();
    const [shipperId, setshipperId] = useState();
    const [Result, setResult] = useState([]);
    const [isloading, setIsLoading] = useState(false);

    //const orderHistoryList = orderHistory [5];

    function handleCreate(e) {
        e.preventDefault();
        setIsLoading(true);
        axios({
            method: 'post',
            url: 'http://34.124.116.30:8080/orders/create',
            data: {
                ogname: props.UserOrg,
                username: props.User,
                userrole: props.UserRole,
                orderId: orderId,
                productId: productId,
                price: price,
                quantity: quantity,
                producerId: producerId,
                retailerId: retailerId
            }
          }).then((response) => {
                setIsLoading(false);
                alert(response.data.message);
                setorderId('');
                setproductId('');
                setprice('');
                setquantity('');
                setproducerId('');
                setretailerId('');
      });
    }

    function handleAssign(e) {
        e.preventDefault();
        setIsLoading(true);
        axios({
            method: 'post',
            url: 'http://34.124.116.30:8080/orders/assign',
            data: {
                ogname: props.UserOrg,
                username: props.User,
                userrole: props.UserRole,
                orderId: orderId,
                shipperId: shipperId
            }
          }).then((response) => {
            setIsLoading(false);
            alert(response.data.message);
            setorderId('');
            setshipperId('');
        });
    }
    
    function handleHistory(e) {
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
            <button  className="button" onClick={() => setcurrentctx('Create Product') }>Create Product</button>
            <button  className="button" onClick={() => setcurrentctx('Assign Shipper') }>Assign Shipper</button>
            <button  className="button" onClick={() => setcurrentctx('Order History') }>Order History</button>
            {isloading && 
                <Spinner animation="border" role="status" variant="light">
                </Spinner>
            } 
            <div>
                { currentctx === 'Create Product' && 
                    <form onSubmit={handleCreate}>
                        <div className="input-container-submit">
                            <label> Order ID</label>
                            <input className="input-box" value={orderId} type="text" required onChange={(e) => setorderId(e.target.value)}/> 
                        </div>
                        <div className="input-container-submit">
                            <label>Product ID</label>
                            <input className="input-box" value={productId} type="text"  required onChange={(e) => setproductId(e.target.value)}/> 
                        </div>
                        <div className="input-container-submit">
                            <label>Price</label>
                            <input  className="input-box" value={price} type="text"  required onChange={(e) => setprice(e.target.value)}/> 
                        </div>
                        <div className="input-container-submit">
                            <label>Quantity</label>
                            <input className="input-box" value={quantity} type="text"  required  onChange={(e) => setquantity(e.target.value)}/> 
                        </div>
                        <div className="input-container-submit">
                            <label>Producer ID</label>
                            <input className="input-box" value={producerId} type="text"  required onChange={(e) => setproducerId(e.target.value)}/> 
                        </div>
                        <div className="input-container-submit">
                            <label>Retailer ID</label>
                            <input className="input-box" value={retailerId} type="text"  required onChange={(e) => setretailerId(e.target.value)}/> 
                        </div>
                        <input className="submit-button"  type="submit" value="Submit" />
                    </form>
                }
            </div>
            <div>
                { currentctx === 'Assign Shipper' && 
                    <form onSubmit={handleAssign}>
                        <div className="input-container-submit">
                            <label> Order ID</label>
                            <input className="input-box" value={orderId} type="text"  required onChange={(e) => setorderId(e.target.value)}/> 
                        </div>
                        <div className="input-container-submit">
                            <label>Shipper ID</label>
                            <input className="input-box" value={shipperId} type="text" required onChange={(e) => setshipperId(e.target.value)} /> 
                        </div>
                        <input  className="submit-button"  type="submit" value="Submit" />
                    </form>
                }
            </div>
            <div>
                { currentctx === 'Order History' && 
                    <form onSubmit={handleHistory}>
                        <div className="input-container-submit">
                            <label> Order ID</label>
                            <input className="input-box" value={orderId} type="text" required onChange={(e) => setorderId(e.target.value)}/> 
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

export default Producer;