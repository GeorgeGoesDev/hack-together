import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext'
import { ConversationType } from '../../types/types';
import './MailBox.css'

export const MailBox = () => {
    const { user, conversations } = useContext(AppContext);
    const navigate = useNavigate();

    const goToConv = (convo: ConversationType) => {
        navigate(`/conversation/${convo?.person1 === user?.username ? convo?.person2 : convo?.person1}`);
    }

    const conv = (convo: ConversationType) => {
        return convo?.messages.filter(m => m.senderUsername !== user?.username && m.read === false).length
    }

    return (<div className='whole-mailbox'>
        {conversations.map((convo, i) => <div className="messages-list-one-message-container" key={i} onClick={() => goToConv(convo)}>
            <div className='one-conversation-header'>
                <h2 className='message-reciever-person'>{convo?.person1 !== user?.username ? convo?.person1 : convo?.person2}</h2>
                {conv(convo) !== 0 && <label className='mailbox-message-number'>{conv(convo)}</label>}
            </div>
            <div className='last-message'>
                <h3>{convo?.messages[convo.messages.length - 1].senderUsername}</h3>
                <p>{convo?.messages[convo.messages.length - 1].messageContent}</p>
            </div>
        </div>)}
    </div>
    )
}
