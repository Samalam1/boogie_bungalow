import { useMemo, useState } from 'react'
import './App.css'
import { Party, PartyUI } from './components/Core/Party'
import {  Game } from './components/Core/Game'
import { Shop, ShopUI } from './components/Core/Shop'

function InitializeNewGame(useSeed:boolean = true){

  let seed = undefined;
  let test =undefined;
  let params = new URLSearchParams(window.location.search);
  if(useSeed&&window.location.href.includes("seed=")){
    seed = params.get("seed");
  }

  test = params.get("test");

  const game = new Game(seed??undefined,test??undefined);
  const player = game.player;

  game.party = new Party(player, player.houseSpace);
  return game;
}

function App() {

  const [game, setGame] = useState(InitializeNewGame());
  const [betweenRounds, setBetweenRounds] = useState(true);
  const [GameEndMessage, setGameEndMessage] = useState("");

  const saveGame = useMemo(()=>()=>{
    localStorage.setItem("game",JSON.stringify(game));
    window.alert("Game Saved");
  },[game]);

  const loadGame = useMemo(()=>()=>{
    const savedGame = localStorage.getItem("game");
    if(savedGame){
      let gme:Game= JSON.parse(savedGame);
      gme.shop = new Shop(gme.shop.shopItems);


      setGame(gme);
      window.alert("Game loaded");
    }
    else{
      window.alert("No saved game found");
    }
  },[game]);

  if(GameEndMessage.length>2){
    return <>
    {GameEndMessage.includes("Win")&&
<style>
  {`

  body{

    background-image:url(/confetti.gif) !important;
    background-size:cover;
    padding-top:60px !important;
  }

  `
  }
</style>
    }
  <h1 style={{color:"white"}}>{GameEndMessage}</h1>
    <button onClick={()=>{setGameEndMessage("")}} style={{marginRight:"12px",width:"100px"}}>Keep Playing</button>
    <button  style={{width:"100px"}}
     onClick={()=>{
      setGameEndMessage("");
      setGame(InitializeNewGame(false));
      setBetweenRounds(true);
    }}> New Game</button>

    </>
  }

  return (
    <>
    {betweenRounds && <ShopUI  onSave={saveGame} onLoad={loadGame} seed={game.seed} day={game.day} player={game.player} shop={game.shop} onDone={()=>{

      game.party = new Party(game.player, game.player.houseSpace);
      setBetweenRounds(false);

      }} />}
     {game.party&&!betweenRounds&& <PartyUI party={game.party}

     day={game.day} onEndGame={(win:boolean)=>{
      setBetweenRounds(true);
      if(win){
        setGameEndMessage("You Win!");
        window.scrollTo(0, 0);
      }
      else if(game.day==25){
          window.scrollTo(0, 0);
          setGameEndMessage("You Lose!");

      }

      game.day++;





     }} /> }
    </>
  )
}

export default App
