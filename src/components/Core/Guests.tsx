export enum EntranceEffect {
    None,
    BringSingleGuest,
    BringTwoGuests,
    PopUp,
    CycleTrouble
}

export enum OnScoreEffect {
    None,
    Auction,
    MaxGuestsBonus,
    OldFriendBonus,
    EmptySpaceBonus,
    DanceBonus,
    TroubleCash,
    TroublePop
}

export enum GuestAction {
    None,
    Peek,
    Boot,
    BootAdjacent,
    BootAll,
    Photo,
    Fetch,
    SwapStar,
    Greet,
    Cheer,
    ClearAllTrouble,
    PermanentPop,
}


export type Guest = {


    name:string,
    pop:number,
    trouble:number,
    key?:string,
    cash:number,
    shopCount:number,
    cost:number,
    stars:number,
    action:GuestAction,
    entranceEffect:EntranceEffect,
    onScoreEffect:OnScoreEffect,
    description:string,
    hasAction:boolean,
    bg:string,

}

export type GuestParams = {

    name:string,
    pop?:number,
    trouble?:number,
    cash?:number,
    shopCount?:number,
    cost?:number,
    stars?:number,
    action?:GuestAction,
    entranceEffect?:EntranceEffect,
    onScoreEffect?:OnScoreEffect,
    description?:string,

}

export interface House {
    maxGuests:number,
    guests:Guest[],

    GetPop():number,
    GetTrouble():number,
}

export const defaultGuestValues:Guest = {

    name:"Unamed",
    pop:0,
    trouble:0,
    cash:0,
    shopCount:4,
    stars:0,
    cost:1,
    entranceEffect:EntranceEffect.None,
    action:GuestAction.None,
    onScoreEffect:OnScoreEffect.None,
    hasAction:false,
    description:"",
    bg:""
}


//combine with default values to get none nul
export function CreateGuest(guestValues:GuestParams):Guest{

    return {

        name:guestValues.name,
        pop:guestValues.pop??defaultGuestValues.pop,
        trouble:guestValues.trouble??defaultGuestValues.trouble,
        cash:guestValues.cash??defaultGuestValues.cash,
        shopCount:guestValues.shopCount?? (guestValues.stars&&guestValues.stars>0)?9999:defaultGuestValues.shopCount,
        cost:guestValues.cost??defaultGuestValues.cost,
        stars:guestValues.stars??defaultGuestValues.stars,
        hasAction:false,
        action:guestValues.action??defaultGuestValues.action,
        entranceEffect:guestValues.entranceEffect??defaultGuestValues.entranceEffect,
        onScoreEffect:guestValues.onScoreEffect??defaultGuestValues.onScoreEffect,
        description:guestValues.description??defaultGuestValues.description,
        bg:defaultGuestValues.bg,

    }
}


let masterGuestList:Guest[] = [];


export function GetGuestDefinitionByName(name:string):Guest{

        if(masterGuestList.length===0){
            masterGuestList = InitializeMasterGuestList();
        }

        return masterGuestList.find(x => x.name == name)??CreateGuest({name:"Guest Not Found"});

}

export function GetMasterGuestList():Guest[]{

        if(masterGuestList.length===0){
            masterGuestList = InitializeMasterGuestList();
        }

        return masterGuestList;
}

export const uniCharArr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


export function InitializeMasterGuestList(){

   let list =[

        CreateGuest({ name: "Old Friend", cost: 1, pop: 1 }), //a
        CreateGuest({ name: "Rich Pal", cost: 3, cash: 1 }), // b
        CreateGuest({ name: "Wild Buddy", pop: 2, trouble: 1 }), //c

        CreateGuest({ name: "Driver", cost: 3, action: GuestAction.Fetch }),//d
        CreateGuest({ name: "Private I.", cost: 4, pop: 2, cash: -1, action: GuestAction.Fetch }),//e

        CreateGuest({ name: "Hippy", cost: 4, trouble: -1 }),//f
        CreateGuest({ name: "Cute Dog", cost: 7, pop: 2, trouble: -1 }),//g

        CreateGuest({ name: "Security", cost: 4, action: GuestAction.Boot }),//h
        CreateGuest({ name: "Wrestler", cost: 9, pop: 2, action: GuestAction.Boot }),//i

        CreateGuest({ name: "Watch Dog", cost: 4, pop: 2, action: GuestAction.Peek }),//j
        CreateGuest({ name: "Spy", cost: 8, cash: 2, action: GuestAction.Peek }),//k

        CreateGuest({ name: "Grillmaster", cost: 5, pop: 2, action: GuestAction.BootAll }),//l
        CreateGuest({ name: "Athlete", cost: 6, pop: 1, cash: 1, action: GuestAction.BootAll }),//m

        CreateGuest({ name: "Dancer", cost: 7,onScoreEffect: OnScoreEffect.DanceBonus }),//n

        CreateGuest({ name: "Mr. Popular", cost: 5, pop: 3, entranceEffect: EntranceEffect.BringSingleGuest }),//o
        CreateGuest({ name: "Celebrity", cost: 11, pop: 2, cash: 3, entranceEffect: EntranceEffect.BringTwoGuests }),//p

        CreateGuest({ name: "Ticket Taker", cost: 4, pop: -1, cash: 2 }),//q

        CreateGuest({ name: "Comedian", cost: 5, cash: -1, onScoreEffect: OnScoreEffect.MaxGuestsBonus }),//r
        CreateGuest({ name: "Photographer", cost: 5, pop: 1, cash: -1, action: GuestAction.Photo }),//s
        CreateGuest({ name: "Caterer", cost: 5, pop: 4, cash: -1 }),//t
        CreateGuest({ name: "Auctioneer", cost: 9, cash: 3 }),//u

        CreateGuest({ name: "Mascot", cost: 5, pop: 1, onScoreEffect: OnScoreEffect.OldFriendBonus }),//v
        CreateGuest({ name: "Introvert", cost: 4, pop: 1 , onScoreEffect: OnScoreEffect.EmptySpaceBonus }),//w

        CreateGuest({ name: "Stylist", cost: 7, cash: -1 , action: GuestAction.PermanentPop }),//x
        CreateGuest({ name: "Bartender", cost: 11, pop: 1 , onScoreEffect: OnScoreEffect.TroubleCash }),//y
       CreateGuest({ name: "Writer", cost: 8, pop: 1, onScoreEffect: OnScoreEffect.TroublePop }),//z

        CreateGuest({ name: "Climber", cost: 12, entranceEffect: EntranceEffect.PopUp }),//A
        CreateGuest({ name: "Cheerleader", cost: 5, pop: 1, action: GuestAction.Cheer }),//B
        CreateGuest({ name: "Greeter", cost: 5, pop: 1, action: GuestAction.Greet }),//C
        CreateGuest({ name: "Magician", cost: 5, pop: 1, action: GuestAction.SwapStar }),//D

        CreateGuest({ name: "Cupid", cost: 8, pop: 1, action: GuestAction.BootAdjacent }),//E
        CreateGuest({ name: "Counselor", cost: 7, action: GuestAction.ClearAllTrouble }),//F

        CreateGuest({ name: "Werewolf", cost: 5, pop: 4 ,entranceEffect:EntranceEffect.CycleTrouble }),//G
        CreateGuest({ name: "Monkey", cost: 3, pop: 4, trouble: 1 }),//H
        CreateGuest({ name: "Rock Star", cost: 5, pop: 3, cash: 2, trouble: 1 }),//I
        CreateGuest({ name: "Gangster", cost: 6, cash: 4, trouble: 1 }),//J
        CreateGuest({ name: "Gambler", cost: 7, pop: 2, cash: 3, trouble: 1 }),//K

        // Star Guests
        CreateGuest({ name: "Alien", cost: 40, stars: 1 }),//L
        CreateGuest({ name: "Leprechaun", cost: 50, cash: 3,stars: 1 }),//M
        CreateGuest({ name: "Genie", cost: 55, action: GuestAction.Fetch,stars: 1 }),//N
        CreateGuest({ name: "Dragon", cost: 30, cash: -3,stars: 1 }),//O
        CreateGuest({ name: "Dinosaur", cost: 25, trouble: 1,stars:  1}),//P
        CreateGuest({ name: "Mermaid", cost: 35, entranceEffect: EntranceEffect.BringSingleGuest,stars:  1 }),//Q
        CreateGuest({ name: "Ghost", cost: 45, action: GuestAction.Boot,stars:  1 }),//R
        CreateGuest({ name: "Unicorn", cost: 45, trouble: -1,stars:  1 }),//S
        CreateGuest({ name: "Superhero", cost: 50, pop: 3,stars:  1 }),//T
    ]

    for(let i = 0;i<list.length;i++){
        let perc = i/list.length;
        let r = Math.floor(perc*360);
        list[i].bg = `hsl(${r},100%,90%)`;

    }


    return list;

}