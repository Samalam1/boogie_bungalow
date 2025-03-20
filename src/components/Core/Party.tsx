import { Guest, GuestAction } from "./Guests";
import { Player } from "./Player";


enum PartyState{
    Normal,
    SelectingGuest,
    SelectingFromContacts
}

export class Party {
    owner:Player;
    guests: Guest[] = [];
    availableGuests: Guest[];


    constructor(owner:Player){

        this.owner = owner;
        this.availableGuests = [...owner.rolodex];

    }



    AdmitRandomGuest(){
        if(this.availableGuests.length > 0){
            //get a random index, remove that guest from available, and add to guests
            let randomIndex = Math.floor(Math.random() * this.availableGuests.length);

            let admitted = {...this.availableGuests[randomIndex]}; // clone values so they can be modified, will need to figure out popularity
            admitted.hasAction = (admitted.action!=GuestAction.None);;
            this.availableGuests.splice(randomIndex, 1);
            this.guests.push(admitted);
        }
    }

    CalculateTrouble(){
        let trouble = 0;
        this.guests.forEach(g => {
            trouble += g.trouble;
        });
        return trouble;
    }

}
