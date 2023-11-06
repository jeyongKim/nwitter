import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { authService } from "fbase";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const { target: { name, value } } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let data = null; 
            if (newAccount) {
                data = await createUserWithEmailAndPassword(
                    authService, email, password
                );
            } else {
                //Log in
                data = await signInWithEmailAndPassword(  //eslint-disable-line no-unused-vars
                    authService, email, password
                );
            }

        } catch (err) {
            setError(err.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input 
                    name="email" 
                    type="text" 
                    placeholder="Email" 
                    required 
                    value={email} 
                    onChange={onChange} 
                    style={{borderColor:'red'}}
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password} 
                    onChange={onChange} 
                />
                <input type="submit" value={newAccount?"Create Account":"Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Create Account" : "Log In"}</span>
        </>
    );
}

export default AuthForm;