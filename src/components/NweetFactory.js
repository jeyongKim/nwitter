import React, {useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = "";
        if(attachment !== ""){
            const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await fileRef.putString(attachment, "data_url")
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const nweetObj = {
            nweet:nweet,
            creatAt:Date.now(),
            creatorId : userObj.uid,
            attachmentUrl
        }
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");
    };
    const onChange = (e) => {
        const {
            target:{ value }
        } = e;
        setNweet(value);
    }
    const onFileChange = (e) => {
        console.log(e.target.files);
        const {
            target : { files } ,
        } = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget : { result }
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachmentClick = () => setAttachment(null);

    return (
        <form onSubmit={onSubmit}  className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                opacity: 0,
                }}
            />
            {attachment && 
                <div className="factoryForm__attachment">
                <img
                  src={attachment}
                  style={{
                    backgroundImage: attachment,
                  }}
                  alt=""
                />
                <div className="factoryForm__clear" onClick={onClearAttachmentClick}>
                  <span>Remove</span>
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              </div>
            }
        </form>
    );

}

export default NweetFactory;