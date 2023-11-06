//import userEvent from "@testing-library/user-event";
import Nweet from "components/Nweet";
import { dbService } from "fbase";
import React, {useEffect, useState} from "react";
import NweetFactory from "components/NweetFactory";


const Home = ({userObj }) => {
    const [nweets, setNweets] = useState([]);
    
    /*
    const getNweets = async () => {
        const dbNweets = await dbService.collection("nweets").get();
        
        dbNweets.forEach((document) => {
            const nweetObject = {
                ...document.data(),
                id : document.id,
            };
            setNweets((prev) => [document.data(), ...prev]);
        });
    };*/
    
    useEffect(() => {
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id : doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        })
        
    }, []);

    return (
        <div className="container">
            <NweetFactory userObj={userObj} />
            <div style={{ marginTop: 100 }}>
                {nweets.map((nw) => (
                    <Nweet key={nw.id} nweetObj={nw} isOwner={nw.creatorId===userObj.uid} />
                ))}
            </div>
        </div>
    );
}
export default Home;