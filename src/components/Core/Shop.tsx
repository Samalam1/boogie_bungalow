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



export function ShopUI({player,shop,onDone,day}:{player:Player,shop:Shop,day:number,onDone:()=>void}){

    const [updateToggle,setUpdateToggle] = useState(false);

    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);

    return <div className="shop">
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


        <PLayerScoreUI infoline="Shop" onInfo={onDone} isFocused={false} pop={player.pop} cta="Next Party" cash={player.cash} day={day} trouble={0} />
    </div>

}