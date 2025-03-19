import { Guest } from "./Guests"
import { Player } from "./Player";

 type GuestShopItem = {
    Guest: Guest,
    available:number
}

class Shop{

    shopItems:GuestShopItem[] = [];

    constructor(shopItems:GuestShopItem[]){
        this.shopItems = shopItems;
    }

    TryBuyGuest(guest:Guest,player:Player){


        let item = this.shopItems.find(x => x.Guest === guest);
        if(item && item.available > 0 && item.Guest.cost <= player.cash){
            item.available--;
            player.cash -= item.Guest.cost;
            player.rolledex.push({...item.Guest}); // clone the guest
            return true;
        }
        return false;
    }




}