// import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.less'

const { Search } = Input
const { Text } = Typography
const { Meta } = Card
const client = new W3CWebSocket('ws://127.0.0.1:3008')

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')
    const [msgs, setMsgs] = useState([])
    const [searchVal, setSearchVal] = useState()
    const whenButtonClicked = (value) => {
        client.send(JSON.stringify({
            type: "message",
            msg: value,
            user: userName,
        }))
        setSearchVal('')
    }
    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client is connected')
        }
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data)
            console.log('got reply!', dataFromServer)

            setMsgs([...msgs, { msg: dataFromServer.msg, user: dataFromServer.user }])
        }
    })
    const msgData = msgs
    console.log("mgsgssgsgsgsgsg :", msgData)

    return (
        <>
            {isLoggedIn ?
                <div>
                    <div className='title'>
                        {/* <button onClick={() => whenButtonClicked("hello")}>Send message</button> */}
                        <Text type='secondary' style={{ fontSize: '36px' }}>WebSocket</Text>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }}>
                        {msgs.map((messages, index) =>
                            <Card key={messages.msg} style={{ width: 300, margin: '16px 4px 0 4 px', alignSelf: userName === messages.user ? 'flex-end' : 'flex-start' }}>
                                <Meta
                                    avatar={
                                        <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{messages.user[0].toUpperCase()}</Avatar>
                                    }
                                    title={messages.user}
                                    description={messages.msg}
                                />
                            </Card>
                        )}
                    </div>
                    <div className='bottom'>
                        <Search
                            placeholder='enter your message here!'
                            enterButton='Send'
                            size='large'
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            onSearch={value => whenButtonClicked(value)}

                        />
                    </div>
                </div>
                :
                <div style={{ padding: '200px 40px' }}>
                    <Search
                        placeholder='Enter Username'
                        enterButton="Login"
                        size='large'
                        onSearch={((value) => {
                            setIsLoggedIn(true)
                            setUserName(value)
                        })} />
                </div>
            }

        </>
    )
};

export default App;
