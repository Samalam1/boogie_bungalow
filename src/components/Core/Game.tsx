import { GetGuestDefinitionByName, GetMasterGuestList, Guest, uniCharArr } from './Guests';
import { Party, shuffleArray } from './Party';
import { Player } from './Player';
import { Shop } from './Shop'; // Adjust the path as necessary

export function CreateRandomShop(seed?:string){

    console.log(seed);
    let nonStars = GetMasterGuestList().filter(x => x.stars<=0);
    let stars = [...GetMasterGuestList().filter(x => x.stars>0)];

    let rGuests = shuffleArray(nonStars).slice(0,13);
    let rStars = shuffleArray(stars).slice(0,2);

    let allGuests = [...rGuests,...rStars].sort((a,b) => a.cost - b.cost);

    if(seed){
        console.log('seed',seed);
        allGuests = [];

        for(let i = 0;i<seed.length;i++){
            let char = seed[i];
            let index = uniCharArr.indexOf(char);
            let guest = GetMasterGuestList()[index];
            if(guest)
            allGuests.push({...guest});
        }


   
    }

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
    seed:string = "";
    constructor(inseed?:string){
        this.player = CreateDefualtPlayer();
        this.shop = CreateRandomShop(inseed);

        if(inseed)
            this.seed = inseed;
        else{
            this.seed = "";
            for(let i = 0;i<this.shop.shopItems.length;i++){
                this.seed += uniCharArr[GetMasterGuestList().indexOf(this.shop.shopItems[i].Guest)];
            }
            
        }


    }

}
