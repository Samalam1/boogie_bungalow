import { useEffect, useState } from "react";
import { Guest } from "./Guests"
import { Player, PLayerScoreUI } from "./Player";
import { GuestCard } from "../UI/GuestCard/GuestCard";

 type GuestShopItem = {
    Guest: Guest,
    available:number
}


function GetHouseUpgradePrice(currentCapacity:number){
    let calc = currentCapacity-3;
    if (calc > 12){
        return 12;
    }
    return calc;

}

export class Shop{

    shopItems:GuestShopItem[] = [];

    constructor(shopItems:GuestShopItem[]){
        this.shopItems = shopItems;
    }

    TryBuySpace(player:Player){

        console.log('try buy space');
        if(player.cash >= GetHouseUpgradePrice(player.houseSpace)){
            player.cash -= GetHouseUpgradePrice(player.houseSpace);
            player.houseSpace++;
            return true;
        }
        return false;

    }





    TryBuyGuest(guest:Guest,player:Player){


        let item = this.shopItems.find(x => x.Guest === guest);
        if(item && item.available > 0 && item.Guest.cost <= player.pop){
            item.available--;
            player.pop -= item.Guest.cost;
            player.contacts.push({...item.Guest}); // clone the guest
            return true;
        }
        return false;
    }




}



export function ShopUI({seed, player,shop,onDone,day}:{seed?:string,player:Player,shop:Shop,day:number,onDone:()=>void}){

    const [updateToggle,setUpdateToggle] = useState(false);
    const [inContacts,setInContacts] = useState(false);

    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);

    if(inContacts){
        return <div className="shop">

            { player.contacts.map((guest,index) => {

                return <GuestCard key={index} guest={guest} />

            })}
            <PLayerScoreUI infoline="Contacts" onInfo={()=>setInContacts(false)} isFocused={false} pop={player.pop} cta="back" cash={player.cash} day={day} trouble={0} />

            </div>
    }

    return <div className="shop">
                <button className="guest-slot "
        style={{height:"auto"}}
            disabled={player.cash < GetHouseUpgradePrice(player.houseSpace)}
            onClick={() => {
                if(shop.TryBuySpace(player)){
                    setUpdateToggle(!updateToggle);
                }
            }}

        >
            <br/>
           <div> 🏠{`(${player.houseSpace}+)`}  </div>
           <div className="house-cash ">${GetHouseUpgradePrice(player.houseSpace)}</div>
        </button>
        {shop.shopItems.map((item,index) => {

            let isBuyable = item.available >0 && item.Guest.cost <= player.pop;

            return <div key={index} className={"shop-item " + (isBuyable?"":"unavailable")}
            onClick={() => {
                if(shop.TryBuyGuest(item.Guest,player)){
                    setUpdateToggle(!updateToggle);
                }
            }}
            >
            { item.available>0?

            <div className="cost-line">
            {item.Guest.cost}
            <span>{item.available<20?"("+item.available+"/"+item.Guest.shopCount+")":"∞"}</span>
            </div>:
            <div className="cost-line">SOLD OUT</div>
            }
                <GuestCard guest={item.Guest}

                />

            </div>
        })}
        <button className="guest-slot " onClick={()=>setInContacts(true)} style={{height:"auto",background:"#aaa",color:"#333"}}>
            View Contacts ☎
        </button>

        {seed &&<div style={{display:"flex",flexDirection:"column",alignItems:"center"}}> <div className="seed-display"
        onClick={()=>{
            navigator.clipboard.writeText(window.location.href.split("?")[0]+"?seed="+seed);
        }}
            style={{padding:"8px",color:"#999",background:"#333",borderRadius:"4px",margin:"8px 0",maxWidth:"200px",cursor:"pointer",wordBreak:"break-all",userSelect:"none",marginBottom:"16px"}}
        >{"Copy Seed Url 📋"}</div>
    <div className="seed-display"
        onClick={()=>{
           if(window.confirm("Are you sure you want to start a new game?")){
               window.location.href = window.location.href.split("?")[0];
           }
        }}
            style={{padding:"8px",color:"#999",background:"#333",borderRadius:"4px",margin:"8px 0",maxWidth:"200px",cursor:"pointer",wordBreak:"break-all",userSelect:"none"}}
        >{"Start New Game"}</div></div>}

        <PLayerScoreUI infoline="Shop" onInfo={onDone} isFocused={false} pop={player.pop} cta="Next Party" cash={player.cash} day={day} trouble={0} />
    </div>

}