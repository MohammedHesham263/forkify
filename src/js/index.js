import Search from './models/Search';
import List from './models/List';
import {elements , renderLoader,loaderRemover} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import Likes from './models/Likes';
/* *Global state of app
 * - search object
 * - current recipe object
 * - shopping list object
 * - liked recipes
*/
const state = {
}

    /*
    SEARCH CONTROLLER!!
    _____________________________
    */

const controlSearch = async() => {
    //1)Get Query from view
    const query =searchView.getInput();   
    if(query){
        //2)New search object and add to state
        state.search = new Search(query);
        //3)Prepare UI for results
        searchView.clearInputField();
        searchView.clearResultList();
        renderLoader(elements.searchRenderLoader)
        try{
        //4)search for recipes
        await state.search.getResults(query);
        //5)render results on UI
        loaderRemover()
        searchView.renderResults(state.search.result);
        }
        catch(err){
            alert('Something went wrong with search ....')
            loaderRemover()
        }
        
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


elements.resultPages.addEventListener('click', e =>{
    const btn =  e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        console.log(goToPage);
        searchView.clearResultList();
        searchView.renderResults(state.search.result , goToPage);
    }
});


    /*
    RECIPE CONTROLLER!!
    _____________________________
    */
const controlRecipe = async () =>{
    const id = window.location.hash.replace('#','');
    if (id) {
        //Prepare UI for change
        recipeView.recipeRemover();
        renderLoader(elements.recipe);
        //highlight selected search item;
        if(state.search) recipeView.highlightSelected(id);
        //create new recipe object
        state.recipe = new Recipe(id);
        
        try{
        //get recipe data
       await state.recipe.getRecipe();
       state.recipe.parseIngredients();
        //Calculate servings and time
        state.recipe.calcServings()
        state.recipe.calcTime()
        //render recipe
        loaderRemover();
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id));
        }
        catch(err){
            console.log(err)
            alert('Error processing recipe!!')
        }
    }
}

/*
    Likes CONTROLLER!!
    _____________________________
    */
  
   
const controlLikes = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    if (!state.likes.isLiked(currentID)){
        //add like to the state
        const newLike = state.likes.addLike(
            currentID ,
            state.recipe.title,
            state.recipe.auther,
            state.recipe.img)
        //toggle the like button
        likesView.toggleLikeBtn(true);
        //add like to UI list
        likesView.renderLike(newLike);
    }else{
        //remove like from the like list
        state.likes.deleteLike(currentID);
        //toggle the like button
        likesView.toggleLikeBtn(false);
        //remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}


/*
    ---------Event Listeners-----------
    _____________________________
    */

window.addEventListener('load',() =>{
    //create the likes object.
    state.likes = new Likes();
    //Read data from localstorage.
    state.likes.readStorage()
    //toggle the likes list.
    likesView.toggleLikeMenu(state.likes.getNumLikes())
    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


['hashchange','load'].forEach( e =>window.addEventListener(e,controlRecipe)) 
    //window.addEventListener('load',controlRecipe)

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if (state.recipe.serving > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateRecipeServings(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateRecipeServings(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // create a shopping list if there is non yet
        if(!state.list) state.list = new List();
        // add each ingredient to the list
        state.recipe.ingredients.forEach(el => {
            const item = state.list.addItem(el.count , el.unit , el.ingredients);
            listView.renderShoppingList(item);
        })
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLikes();
    }
        
});

elements.shopping.addEventListener('click',e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // delete item from the object
        state.list.deleteItem(id)
        // delete item from the UI
        listView.deleteItem(id)
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id , val);
    }

})

