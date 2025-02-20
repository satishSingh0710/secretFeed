"use client"
import {socket} from "@/socket"
import { useState, useEffect } from "react";


export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
  
    useEffect(() => {
      if (socket.connected) {
        onConnect();
      }
  
      function onConnect() {
        setIsConnected(true);
        setTransport(socket.io.engine.transport.name || "N/A");
  
        socket.io.engine.on("upgrade", (transport) => {
          setTransport(transport.name);
        });
      }
  
      function onDisconnect() {
        setIsConnected(false);
        setTransport("N/A")
      }
  
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
  
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    }, []);

    async function handleClick() {
        socket.emit("newMessage", "The hell is wrong with you ??"); 
    }
  
    return (
      <div>
        <p>Status: { isConnected ? "connected" : "disconnected" }</p>
        <p>Transport: { transport }</p>
        <button onClick={handleClick}>CLICK ME</button>
      </div>
    );
  }