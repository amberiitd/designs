import { randomUUID } from "crypto";

export class SimpleSubscription{
    private subscriptionMap: { [key: string]: {callBack: (data: any) => void;} };
    constructor(){
        this.subscriptionMap = {};
    }

    public subscribe(callBack: (data: any) => void){
        const id = this.makeid(5);
        this.subscriptionMap[id] = {
            callBack: callBack
        }

        return id;
    }

    public unsubscribe(id: string){
        if (this.subscriptionMap[id]){
            delete this.subscriptionMap[id];
        }
    }

    public dispatch(data: any){
        Object.values(this.subscriptionMap).forEach(f => {
            try{
                f.callBack(data)
            }catch(e){
                console.log(e)
            }
        });
    }

    private makeid(length: number){
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
}