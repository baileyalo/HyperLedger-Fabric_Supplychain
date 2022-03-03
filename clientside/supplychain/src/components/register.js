import React, { useState}  from "react";
import axios from 'axios';
import '../App.css';
import {  Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

 function Register(props) {

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [role, setrole] = useState('');
    const [isloading, setIsLoading] = useState(false);

    function handleRegisterEnroll(e) {
        e.preventDefault();
        setIsLoading(true);
        axios({
            method: 'post',
            url: 'http://34.124.116.30:8080/users/enroll&register',
            data: {
                username: username,
                password: password,
                organization: props.UserOrg,
                role: role
            }
          }).then((response) => {
            setIsLoading(false);
            if(!response.data.status){
                alert(response.data.error.message);
                setusername('');
                setpassword('');
                setrole('');
            } 
            else{
                alert(response.data.message);
                setusername('');
                setpassword('');
                setrole('');
            }
            
        });
    }
    
    return(
        <div >
            <form  onSubmit={handleRegisterEnroll}>
                {isloading && 
                    <Spinner animation="border" role="status" variant="light">
                    </Spinner>
                } 
                <br></br>
                <div className="input-container-submit">
                    <label>Username</label>
                    <input type="text" className="input-box" value={username} required onChange={(e) => setusername(e.target.value)}/> 
                </div>
                <div className="input-container-submit">
                    <label>Password</label>
                    <input type="password" className="input-box" value={password} required onChange={(e) => setpassword(e.target.value)}/> 
                </div>
                <div className="input-container-submit">
                    <label>Role</label>
                    <input type="text" className="input-box" value={role} required onChange={(e) => setrole(e.target.value)}/>
                </div>
                <input className="submit-button"  type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default Register;