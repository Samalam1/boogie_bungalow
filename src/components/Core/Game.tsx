import { GetGuestDefinitionByName, GetMasterGuestList, Guest } from './Guests';
import { Party, shuffleArray } from './Party';
import { Player } from './Player';
import { Shop } from './Shop'; // Adjust the path as necessary

export function CreateRandomShop(){

    let nonStars = GetMasterGuestList().filter(x => x.stars<=0);
    let stars = [...GetMasterGuestList().filter(x => x.stars>0)];

    let rGuests = shuffleArray(nonStars).slice(0,13);
    let rStars = shuffleArray(stars).slice(0,2);

    let allGuests = [...rGuests,...rStars].sort((a,b) => a.cost - b.cost);

  return new Shop(allGuests.map(x => {return {Guest:x,available:x.shopCount}}));
}

export function CreateDefualtPlayer(){
    const createGuestQuant = (guest:Guest, count:number) => {

        let arr = [];
        for(let i=0;i<count;i++){
            arr.push({...guest});
        }
        return arr;
    }

    let list = [
        ...createGuestQuant(GetGuestDefinitionByName("Old Friend"),4),
        ...createGuestQuant(GetGuestDefinitionByName("Rich Pal"),2),
        ...createGuestQuant(GetGuestDefinitionByName("Wild Buddy"),4),
    ]

    return new Player(list);

}

export class Game{

    shop:Shop;
    player:Player;
    party:Party|null = null;
    day:number = 1;
    constructor(){
        this.player = CreateDefualtPlayer();
        this.shop = CreateRandomShop();




    }

}

