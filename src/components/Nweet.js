import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.nweet);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure delete?");
        if(ok){
            //delete
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        //console.log(nweetObj, newNweet);
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            nweet : newNweet
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target : { value }
        } = event;
        setNewNweet(value);
    }
    return (
        <div className="nweet">
            {
                editing ? (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input 
                            type="text" 
                            placeholder="Edit your tweet" 
                            value={newNweet} 
                            required 
                            autoFocus
                            onChange={onChange}
                            className="formInput"
                        />
                        <input type="submit" value="Update Nweet" className="formBtn" />
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
                )
                :
                (<>
                    <h4>{nweetObj.nweet}</h4>
                    {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt="" />}
                    {isOwner && (
                        <div class="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>)
            }
        </div>
    );
};

export default Nweet;