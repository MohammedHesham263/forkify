import {elements} from './base';

export const getInput = () => elements.searchField.value;

export const clearInputField = () => {
    elements.searchField.value = '';
}
export const clearResultList = () => {
    elements.resultList.innerHTML='';
    elements.resultPages.innerHTML = '';
}

/*
    title : pasta with tomato and spinach
    acc = 0 , pasta a = 5
    acc = 5 , pasta with a = 9
    acc = 9 , pasta with tomato a = 15
    acc = 15 , pasta with tomato and a = 18

*/
const limitRecipeTitle = (title , limit = 17) =>{
    const newTitle = [];
    if(title.length > limit)
    {
        title.split(' ').reduce( (acc , cur)=>{
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0)
        return `${newTitle.join(' ')} ...`
    }
    return title;
}
const renderRecipes = recipe => {
    const markup = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
    </li>
    `
    elements.resultList.insertAdjacentHTML('beforeend',markup);
}

const createButton = (page , type)=>
    `
    <button class="btn-inline results__btn--${type}" data-goto=${type == 'prev'? page -1 : page+1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type == 'prev'? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type == 'prev'? page -1 : page+1}</span>
    </button>
    `

const renderButton = (page , numOfResults , resPerPage)=>{
    const pages = Math.ceil(numOfResults/resPerPage);
    let button ; 
    if(page ===  1 && pages > 1){
        //create Next page button
        button = createButton(page , 'next');
    }else if(page < pages){
        //create both Next and Prev buttons
        button=`
        ${createButton(page,'next')}
        ${createButton(page,'prev')}
        `;
        
    }else if(page === pages && pages >1){
        //create Prev Button
        button = createButton(page , 'prev')
    }
    elements.resultPages.insertAdjacentHTML('afterbegin',button);
}

export const renderResults = (recipes , page = 1 , resPerPage = 10) => 
{
    const start = (page - 1)*resPerPage;
    const end = page * resPerPage;
    recipes.slice(start,end).forEach(renderRecipes);
    // render paginating buttons
    renderButton(page , recipes.length , resPerPage)
}