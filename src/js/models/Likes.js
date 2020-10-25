export default class Likes {
    constructor(){
        this.likes = []; 
    }

    addLike(id , title , auther , img){
        const like = {id , title , auther , img};
        this.likes.push(like);
        //persist data to localstorage
        this.persistData();
        return like;
    }
    deleteLike(id){
        const Index =  this.likes.findIndex(el => el.id === id);
        this.likes.splice(Index,1);
        //persist data to localstorage
        this.persistData();
    }
    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    getNumLikes(){
        return this.likes.length;
    }
    persistData(){
        localStorage.setItem("likes",JSON.stringify(this.likes));
    }
    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage) this.likes = storage;
    }
}