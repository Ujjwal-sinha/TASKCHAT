import React, {useState} from 'react'
import './LogIn.css';
import { useNavigate } from 'react-router-dom';
import { form_backend } from '../../../../declarations/form_backend';

function LogIn() {
  const [isLogIn, setIsLogIn] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    pass: "",
    confirmpass: "",
  });
  const [errMsg, setErrMsg] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg();
    if(formData.username.length === 0) {
      setErrMsg("Username can't be blank");
    } else if(formData.username.length < 4) {
      setErrMsg("Minimum username length is 4");
    } else if(formData.pass.length === 0) {
      setErrMsg("Password can't be blank");
    } else if(!isLogIn) {
      if(formData.confirmpass != formData.pass) {
        setErrMsg("Passwords are not matching");
      } else if(formData.confirmpass.length < 5) {
        setErrMsg("Minimum password length is 6");
      } else {
        // Perform user registration and handle promise resolution or rejection
        form_backend.registerUser(formData.username, formData.pass)
          .then((result) => {
            setIsLogIn(true); // Set login state to true upon successful registration
          })
          .catch((error) => {
            setErrMsg("Username already exists"); // Set error message for existing username
          });
      }
    } else {
      const msg = await form_backend.isCorrectPassword(formData.username, formData.pass);
      if(msg == "Success") {
        navigate("/todo");
      } else {
        setErrMsg(msg);
      }
    }
  };
  const handleClick = () => {
    setIsLogIn(!isLogIn);
    setErrMsg("");
  };

  return (
    <div id="login">
      <div id="left">
        <img src="gL9EszK.png" alt="logo"></img>
      </div>
      <div id="right">
        <form>
          <h1>Welcome to Chatroom</h1>
          {isLogIn ? (<h2>Log In</h2>) : (<h2>Sign In</h2>)}
          <div id="lcontent">
            <div id="fleft">
              <label htmlFor='username'>Username</label>
              <label htmlFor='pass'>Password</label>
              {!isLogIn && (
                <label htmlFor='confirmpass'>Re-Confirm Password</label>
              )}
            </div>
            <div id="fright">
              <input type="text" name='username' id="username" onChange={handleChange} />
              <input type="password" name="pass" id="pass" onChange={handleChange} />
              {!isLogIn && (
                <input type="password" name="confirmpass" id="confirmpass" onChange={handleChange} />
              )}
            </div>
          </div>
          <p id="error">{errMsg}</p>
          <div id="button">
            <button type="button" onClick={handleSubmit}>{isLogIn ? 'Log In' : 'Sign In'}</button>
            {isLogIn && (
              <p onClick={handleClick}>Don't have an account? Register Here</p>
            )}
            {!isLogIn && (
              <p onClick={handleClick}>Already have an account? LogIn Here</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
