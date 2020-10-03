const meals = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const searchTerm = document.getElementById('search-term');
const serachBtn = document.getElementById('search');


getRandomMeal();
fetchFavMeals();
// get random meal from API data
async function getRandomMeal() {
   
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
   
    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    console.log(randomMeal);

    addMeal(randomMeal, true);
}
//get meal by  meal id
async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+ id);
    
    const respData = await resp.json();

    const meal =  respData.meals[0];
    return meal;
    console.log(meal);
}
//serach meal by entering into search box
async function getMealBySearch(term) {
    const resp =  await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);
    const respData = await resp.json();
    const meals = respData.meals;
    return meals;


}

//Display random meal

 function addMeal(mealData, random = false){
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML =`
        <div class="meal-header">
        ${random ? `
        <span class="random">
                            Random Recipe
        </span>`:''}
            
        <img src="${mealData.strMealThumb}" 
             alt ="${mealData.strMeal}">
        </div>
        <div class="meal-body">
                    <h4>${mealData.strMeal}</h4>
                    <button class ="fav-btn">
                        <i class="fas fa-heart"></i>
                    </button>
        </div>
        
    `;
    // add button for favorite meal
    const btn = meal.querySelector(".meal-body .fav-btn")
    btn.addEventListener("click", () => {

        if(btn.classList.contains("active")){
            removeMealFromLS(mealData.idMeal);
            btn.classList.remove("active");
        }else {
            addMealToLS(mealData.idMeal);
            btn.classList.add("active");
        }
       
        fetchFavMeals();
    })
    meals.appendChild(meal);
}
// Add meal id to Local storage 
function addMealToLS(mealId){
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify
    ([...mealIds, mealId]));
}
// Remove meal from local storage
function removeMealFromLS(mealId){
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify
    (mealIds.filter(id => id !== mealId)));
}
// Get meal from Local Storage

function getMealsFromLS(){
const mealIds = JSON.parse(localStorage.
    getItem('mealIds'));
    return mealIds === null ? [] : mealIds;
}
// method to fetch favorite meal 

async function fetchFavMeals(){
    favoriteContainer.innerHTML='';
    const mealIds = getMealsFromLS();

    const meals = [];

    for(let i =0; i< mealIds.length; i++){
        const mealId = mealIds[i];

        meal = await getMealById(mealId);

        addMealToFav(meal);
    }
}
// add Favorite meal to favorite container
function addMealToFav(mealData){
    const favMeal = document.createElement('li');
    
    favMeal.innerHTML =`
        
                <img src="${mealData.strMealThumb}" 
                    alt="${mealData.strMeal}">
                <span>${mealData.strMeal}</span>
                <button class="clear"><i class="fas fa-window-close"></i></button>
    `;
    const btn = favMeal.querySelector('.clear');
    btn.addEventListener("click", ()=> {
        removeMealFromLS(mealData.idMeal);

        fetchFavMeals();
    })
            favoriteContainer.appendChild(favMeal);  

}
// show meal according to search term 
serachBtn.addEventListener("click", async () => {
     const search = searchTerm.value;

   const meals = await getMealBySearch(search);
   meals.forEach((meal) => {
       addMeal(meal);
   });
})