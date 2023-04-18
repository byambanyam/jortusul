require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import list from "./model/list";
import * as listView from "./view/listView";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView";

/**
 * Web app төлөв
 * - Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * - Лайкласан жорууд
 * - Захиалж байгаа жорын найрлаганууд
 */

const state = {};

/**
 * Хайлтын контроллер = Model ==> Controller <== View
 */
const controlSearch = async () => {
  // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
  const query = searchView.getInput();

  if (query) {
    // 2) Шинээр хайлтын обьектийг үүсгэж өгнө.
    state.search = new Search(query);

    // 3) Хайлт хийхэд зориулж дэлгэцийг UI бэлтгэнэ.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);

    // 4) Хайлтыг гүйцэтгэнэ
    await state.search.doSearch();

    // 5) Хайлтын үр дүнг дэлгэцэнд үзүүлнэ.
    clearLoader();
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй...");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

/**
 * Жорын контролллер
 */
const controlRecipe = async () => {
  // 1) URL-аас ID-ийг салгаж
  const id = window.location.hash.replace("#", "");
  if (id) {
    // 2) Жорын моделийг үүсгэж өгнө.
    state.recipe = new Recipe(id);

    // 3) UI дэлгэцийг бэлтгэнэ.
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);

    // 4) Жороо татаж авчирна.
    await state.recipe.getRecipe();

    // 5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();

    // 6) Жороо дэлгэцэнд гаргана
    renderRecipe(state.recipe);
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);
/**
 * найрлагын контроллер
 */
const controlList = () => {
  // nairlagnii model uusgen
  state.list = new list();

  listView.clearItems();
  // ug modelruu odoo haragdaj baigaajornii buh nailagiig awch hiin
  state.recipe.ingredients.forEach((n) => {
    // tuhain nairlagiig modelruu hiiin
    const item = state.list.additem(n);
    // tuhain nairlagaiig delgetsende gargana
    listView.renderitem(item);
  });
};
elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  }
});
elements.shoppingList.addEventListener("click", (e) => {
  // click hiisen li n data item
  const id = e.target.closest(".shopping__item").dataset.itemid;
  // oldson id tai ortsiig ustgana
  state.list.deleteItem(id);
  // delgetsees iim idtei ortsiig ustgana
  listView.deleteItem(id);
});
