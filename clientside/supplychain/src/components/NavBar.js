import React  from "react";
import {Link} from "react-router-dom";

function Navbar(props){

    return(
        <nav className="navbar">

            { props.User === 'admin' && 
             <div className="links">
                <h4><Link  to = "/Register"> Register</Link></h4>
            </div>
            }
            <div className="links">
            { (props.UserRole === 'producer' || props.User === 'admin')&& 
                 <h4><Link  to = "/Producer"> Producer</Link></h4>
            }
            </div>

            <div className="links">
            { (props.UserRole === 'shipper'  || props.User === 'admin')&& 
                <h4><Link   to = "/Shipper"> Shipper</Link></h4>
            }
            </div>
                    
            <div className="links">
            { (props.UserRole === 'retailer'  || props.User === 'admin')&& 
                <h4><Link to = "/Retailer"> Retailer</Link></h4>
            }
            </div>
                    
            <div className="links">
            { (props.User === 'admin' || props.UserRole === 'customer') && 
                <h4><Link  to = "/Customer"> Customer</Link></h4>
            }
            </div>

            <div className="links">
            { (props.User === 'admin' || props.UserRole === 'regulator') && 
                <h4><Link to = "/Regulator"> Regulator</Link></h4>
            }
            </div>

           
        </nav>
    )
}

export default Navbar;