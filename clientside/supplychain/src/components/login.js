import React, { useState}  from "react";
import axios from 'axios';
import '../App.css';
import {  Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({setUser,setUserRole,setUserOrg}) {

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const [organization, setorganization] = useState('org1');   
    const orgOptions = [
        { label: 'Organisation 1', value: 'org1' },
        { label: 'Organisation 2', value: 'org2' },
        { label: 'Organisation 3', value: 'org3' },
      ]; 

    function handleLogin(e) {
        e.preventDefault();
        setIsLoading(true);
        //set token when login successfull
        axios.get('http://34.124.116.30:8080/users/login', {
            params: {
               username: username,
               password: password,
               organization: organization
            }
            }).then((response) => {
                setIsLoading(false);
                if(!response.data.status){
                    alert(response.data.error.message);
                    setusername('');
                    setpassword('');
                    setorganization('org1');
                } 
                else{
                    setUser(response.data.user);
                    setUserRole(response.data.role);
                    setUserOrg(organization);
                }

            });
    }
    
    return(
        <div className="app">
            {isloading && 
                <Spinner animation="border" role="status" variant="light">
                </Spinner>
            } 
            <div className="login-form">
                <div className="title">Sign In</div>
  
                <div className="form">
                    <form  onSubmit={handleLogin}>
                        <div className="input-container">
                            <label>Username </label>
                            <input className="input-box"  type="text" value = {username} required onChange={(e) => setusername(e.target.value)}/>
                        </div>
                        <div className="input-container">
                            <label>Password </label>
                            <input className="input-box"  type="password" value = {password} required onChange={(e) => setpassword(e.target.value)}/>
                        </div>
                            
                        <div className="input-container">
                            <label>Organisation </label>
                            <select className="input-box"  value ={organization} onChange={(e) => setorganization(e.target.value)}>
                                {orgOptions.map((option) => (
                                    <option value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="button-container">
                            <input type="submit" />
                        </div>
                        
                    </form>    
                </div>
            </div>
        </div>
    )
}
export default Login;