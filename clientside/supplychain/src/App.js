import { useState}  from "react";

import './App.css';
import Navbar from "./components/NavBar";
import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route,Routes} from "react-router-dom"; 
import Producer from "./components/producer";
import Shipper from "./components/shipper";
import Retailer from "./components/retailer";
import Customer from "./components/customer";
import Regulator from "./components/regulator";
import Login from './components/login';
import Register from "./components/register";

function App() {

    const [User, setUser] = useState();
    const [UserRole, setUserRole] = useState();
    const [UserOrg, setUserOrg] = useState();

    if(!User) {
        return <Login setUser={setUser} setUserRole={setUserRole}  setUserOrg={setUserOrg} />
    }

    return (

        <div>
            <div className="title-section">
            Username: {User}  :  {UserOrg}
                <button className="button" onClick={() => setUser('') }>Logout</button>
                
            </div>   
            <Router>
                <Fragment>
                    <div className="app-home"> 
                        <div className="Navbar">
                            <Navbar User={User}  UserRole={UserRole}  UserOrg={UserOrg}/>
                        </div>
                        <div className="content">
                     
                            { User === 'admin' && 
                                <Routes>  
                                    <Route path = "/Register" element={<Register User={User}  UserRole={UserRole}  UserOrg={UserOrg} />}>
                                    </Route>
                                </Routes>  
                            }
                            { (UserRole === 'producer'  || User === 'admin') && 
                                <Routes>  
                                    <Route path = "/Producer" element={<Producer User={User}  UserRole={UserRole}  UserOrg={UserOrg} />}>
                                    </Route>
                                </Routes>  
                            }
                            { (UserRole === 'shipper' || User === 'admin') && 
                                <Routes>  
                                    <Route path = "/Shipper" element={<Shipper User={User}  UserRole={UserRole}  UserOrg={UserOrg}/>}>
                                    </Route>
                                </Routes>  
                            }

                            { (UserRole === 'retailer' || User === 'admin') && 
                                <Routes>  
                                    <Route path = "/Retailer" element={<Retailer User={User}  UserRole={UserRole}  UserOrg={UserOrg}/>}>
                                    </Route>
                                </Routes>  
                            }
                            { (UserRole === 'regulator' || User === 'admin') && 
                                <Routes>                          
                                    <Route path = "/Regulator" element={<Regulator User={User}  UserRole={UserRole}  UserOrg={UserOrg}/>}>
                                    </Route>
                                </Routes>  
                            }
                            { (UserRole ===   'customer' || User === 'admin') && 
                                <Routes>                            
                                    <Route path = "/Customer" element={<Customer User={User}  UserRole={UserRole}  UserOrg={UserOrg} />}>
                                    </Route>
                                </Routes>  
                            }
                        </div>  
                    </div> 
                </Fragment>
            </Router>
        </div>
    );
}

export default App;





