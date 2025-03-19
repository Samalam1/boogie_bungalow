import React, { useState, useEffect } from "react";
import Peer, { DataConnection } from "peerjs";

export default function PeerTest(){

    const [peer, setPeer] = useState<Peer|null>(null);
    const [connection, setConnection] = useState<DataConnection|null>(null);
    const [peerId, setPeerId] = useState("");
    const [myId, setMyId] = useState("");
    const [gameLog, setGameLog] = useState<string[]>([]);

    useEffect(() => {
        const newPeer = new Peer(); // Creates a new Peer connection
        setPeer(newPeer);

        newPeer.on("open", id => {
            setMyId(id); // Show the player's own ID
        });

        newPeer.on("connection", conn => {
            conn.on("data", data => {
                setGameLog(log => [...log, `Opponent: ${data}`]); // Update game log
            });
            setConnection(conn);
        });

        return () => newPeer.destroy();
    }, []);

    const connectToPeer = () => {
        if (peer) {
            const conn = peer.connect(peerId);
            conn.on("open", () => setConnection(conn));
            conn.on("data", data => {
                setGameLog(log => [...log, `Opponent: ${data}`]); // Update game log
            });
        }
    };
    const switchToPlayer2 = () => {
        // Player 2 becomes the new host
        const newPeer = new Peer(); // Create a new Peer instance
        setPeer(newPeer); // Save the new peer

        newPeer.on("open", (newId) => {
            console.log("Player 2 is now the host with ID:", newId);
            setMyId(newId);

            // Reconnect to Player 1 (if they reconnect later) or notify both players
            // Send the current game state to Player 2
            //sendInitialStateToNewHost(newPeer);
        });

        newPeer.on("connection", (newConnection) => {
            // Handle incoming connection (from Player 1, if they reconnect, or other players)
            setConnection(newConnection);
            newConnection.on("data", (data) => {
                // Handle data (game moves, updates, etc.)
                setGameLog(log => [...log, `Opponent: ${data}`]);
            });
        });
    };
    const sendMove = (move:string) => {
        if (connection) {
            connection.send(move);
            setGameLog(log => [...log, `You: ${move}`]);
        }
    };

    return (
        <div>
            <h1>Board/Card Game</h1>
            {!connection?
            <>
            <p>Your ID: <strong>{myId}</strong></p>
            <input
                defaultValue={peerId}
                onChange={e => setPeerId(e.target.value)}
                placeholder="Enter opponent's ID"
            />
            <button onClick={connectToPeer}>Connect</button>
            </>:
            <p>Connected to opponent: {connection.connectionId}</p>
            }
            <h2>Game Log</h2>
            <div style={{ border: "1px solid black", padding: "10px", height: "200px", overflowY: "scroll" }}>
                {gameLog.map((entry, index) => (
                    <p key={index}>{entry}</p>
                ))}
            </div>

            <h2>Send Move</h2>
            <button onClick={() => sendMove("Played Ace of Spades")}>Play Ace of Spades</button>
            <button onClick={() => sendMove("Drew a card")}>Draw a Card</button>
        </div>
    );
};
