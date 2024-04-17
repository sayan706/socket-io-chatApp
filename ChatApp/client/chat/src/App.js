import React, { useEffect, useMemo } from 'react';
import {io} from 'socket.io-client';
import {Button, Container, Stack, TextField, Typography} from '@mui/material';
import { useState } from 'react';

function App() {
  
  const Baseurl = "http://localhost:8080";
   // eslint-disable-next-line
  const socket = useMemo(()=>io(Baseurl),[]);

  const [message,setMessage] = useState("");
  const [room,setRoom] = useState("");
  const [socketId,setsocketId] = useState("");
  const [messages,setMessages] = useState([]);

  console.log(messages);


  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit("message",{message,room});
    setMessage("");
  }

  useEffect(()=>{
    socket.on("connect",()=>{
      setsocketId(socket.id);
      console.log("connected",socket.id);
    });
    socket.on("recieve-message",(data)=>{
      console.log(data);
      setMessages((messages) => [...messages,data]);
    })
    // socket.on("welcome",(s)=>{
    //   console.log(s);
    // });
    // socket.on("join",(e)=>{
    //   console.log(e);
    // })
    return ()=>{
      socket.disconnect();
    };
    // eslint-disable-next-line
  },[]);

  return (
    <>
    <Container maxwidth="sm" style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '300px 0' 
    }}>
      <Typography variant="h1" component="div" gutterBottom>  </Typography>

      <Typography variant="h6" component="div" gutterBottom>{socketId}</Typography>


      <Stack>
        {messages.map((m,i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
     

      <form onSubmit={handleSubmit}>
        <TextField value={message} 
        onChange={e=>setMessage(e.target.value)}
        id="outlined-basic" 
        label="Message" 
        variant="outlined"/>
      
        <TextField value={room} 
        onChange={e=>setRoom(e.target.value)}
        id="outlined-basic" 
        label="Room" 
        variant="outlined"/>
        <Button type="submit" variant="contained" color="primary">Send</Button>
      </form>
    </Container>
    </>
  )
}

export default App