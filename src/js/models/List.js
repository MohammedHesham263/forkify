import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.item = [];
    }

    addItem(count,unit,ingredients){
        const item = {
            id:uniqid(),
            count,
            unit,
            ingredients
        }
        this.item.push(item);
        return item;
    }

    deleteItem(id){        
        const itemIndex = this.item.findIndex(el => el.id == id)
        //[1,2,3,4] splice(1,2) return [2,3] , orginal array [1,4]
        //[1,2,3,4] slice(1,2) return [2] , original array [1,2,3,4]

        this.item.splice(itemIndex , 1);
    }
    updateCount(id , newCount){
        this.item.find(el => el.id == id).count = newCount; 
    }
}