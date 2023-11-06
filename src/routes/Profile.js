import { authService, dbService } from "fbase";
//import { onChildAdded } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName?userObj.displayName:"");
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
        
    };
    const getMyNweets = async () => {
        const nweets = await dbService.collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
        console.log(nweets.docs);
    }
    useEffect(() => {
        getMyNweets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onChage = (e) => {
        const {
            target : {value}
        } = e;
        setNewDisplayName(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({
                displayName : newDisplayName,
            });
            refreshUser();
        }
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                    onChange={onChage}
                    type="text" 
                    placeholder="Display name" 
                    value={newDisplayName}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    );
}

export default Profile;