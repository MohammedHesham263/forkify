import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }
    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            
            this.title = res.data.recipe.title;
            this.auther = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.URL = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }
        catch(error){
            alert('something went wrong :(');
        }
    }

    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15 ; 
    }

    calcServings(){
        this.serving = 4;  
    }

    parseIngredients(){
    const longUnits = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','bounds'];
    const shortUnits = ['tbsp','tbspoon','oz','oz','tsp','tsp','cup','pound'];
    const units = [...shortUnits,'kg','g'];
    const newIngredients = this.ingredients.map(el =>{
        let ingredients = el.toLowerCase();
        //1-Uniform units
        longUnits.forEach((unit,i) => {
            ingredients = ingredients.replace(unit,shortUnits[i])
        });
        //2-remove parentheses
        ingredients = ingredients.replace(/ *\([^)]*\) */g,' ');
        //3-parse ingredients into units , count and ingredient

        const arrIng = ingredients.split(' ');
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

        let objIng;
        if(unitIndex > -1){
            //then there is a Unit
            const arrCount = arrIng.slice(0,unitIndex)

            let count;
            if(arrCount.length === 1){
                count = eval(arrIng[0].replace('-','+'));
            }else{
                count = eval(arrCount.slice(0,unitIndex).join('+'));
            }

            objIng = {
                count,
                unit:arrIng[unitIndex],
                ingredients:arrIng.slice(unitIndex + 1).join(' ')
            }

        }else if (parseInt(arrIng[0],10)){
            // then No unit , but first element is a number
            objIng = {
                count : parseInt(arrIng[0],10),
                unit : '',
                ingredients : arrIng.slice(1).join(' ')
            }
        }else if (unitIndex === -1){
            // Then there is no unit and no number in the first position
            objIng = {
                count : 1,
                unit : '',
                ingredients
            }
        }

        return objIng;
    })
    this.ingredients = newIngredients;
    }

    updateServings(type){
        
        //update the servings
        const newServings = type === 'dec' ?  this.serving - 1 :  this.serving + 1;
        //update ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings/this.serving)
        })
        this.serving = newServings;
    }

}