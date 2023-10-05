import { startTransition, useEffect, useState } from "react";
// import AppContextProvider from "contexts/AppContext";
import "./assets/styles/styles.scss";
// import { AddEditRecipeForm, AppRouter, LoginView } from "config/C4";
import { AddEditRecipeForm, LoginView } from "config/C4";
import FirebaseAuthServices from "./FirebaseAuthService";
import FirebaseFirestoreService from "FirebaseFirestoreService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [user, setUser] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [orderBy, setOrderBy] = useState("publishDateDesc");
  const [recipesPerPage, setRecipesPerPage] = useState(3);

  useEffect(() => {
    setIsLoading(true);
    fetchRecipes()
      .then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      })
      .catch((error) => {
        console.error(error.message);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, categoryFilter, orderBy, recipesPerPage]);

  FirebaseAuthServices.subscribeToAuthChanges(setUser);

  async function fetchRecipes(cursorId = "") {
    const queries = [];

    if (categoryFilter) {
      queries.push({
        field: "category",
        condition: "==",
        value: categoryFilter,
      });
    }

    if (!user) {
      queries.push({
        field: "isPublished",
        condition: "==",
        value: true,
      });
    }

    const orderByField = "publishDate";

    let orderByDirection;

    if (orderBy) {
      switch (orderBy) {
        case "publishDateAsc":
          orderByDirection = "asc";
          break;
        case "publishDateDesc":
          orderByDirection = "desc";
          break;
        default:
          break;
      }
    }

    let fetchedRecipes = [];

    try {
      const response = await FirebaseFirestoreService.readDocuments({
        collection: "recipes",
        queries: queries,
        orderByField: orderByField,
        orderByDirection: orderByDirection,
        perPage: recipesPerPage,
        cursorId: cursorId,
      });

      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000);

        return { ...data, id };
      });

      if (cursorId) {
        fetchedRecipes = [...recipes, ...newRecipes];
      } else {
        fetchedRecipes = [...newRecipes];
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    }

    return fetchedRecipes;
  }

  function handleRecipesPerPageChange(event) {
    const recipesPerPage = event.target.value;
    startTransition(() => {
      setRecipes([]);
      setRecipesPerPage(recipesPerPage);
    });
  }

  function handleLoadMoreRecipesClick() {
    const lastRecipe = recipes[recipes.length - 1];
    const cursorId = lastRecipe.id;

    handleFetchRecipes(cursorId);
  }

  async function handleFetchRecipes(cursorId = "") {
    try {
      const fetchedRecipes = await fetchRecipes(cursorId);

      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function handleAddRecipe(newRecipe) {
    try {
      const response = await FirebaseFirestoreService.createDocument(
        "recipes",
        newRecipe
      );

      handleFetchRecipes();

      alert(`succesfully create a recipe with an id = ${response.id}`);
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleUpdateRecipe(newRecipe, recipeId) {
    try {
      await FirebaseFirestoreService.updateDocument(
        "recipes",
        recipeId,
        newRecipe
      );

      handleFetchRecipes();
      alert(`succesfully updated a recipe with an ID = ${recipeId}`);
      setCurrentRecipe(null);
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function handleDeleteRecipe(recipeId) {
    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete this recipe? OK for Yes. Cancel for No."
    );

    if (deleteConfirmation) {
      try {
        await FirebaseFirestoreService.deleteDocument("recipes", recipeId);

        handleFetchRecipes();

        setCurrentRecipe(null);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        alert(`succesfully deleted recipe ${recipeId}`);
      } catch (error) {
        alert(error.message);
        throw error;
      }
    }
  }

  function handleEditRecipeClick(recipeId) {
    const selectedRecipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });

    if (selectedRecipe) {
      startTransition(() => {
        setCurrentRecipe(selectedRecipe);
      });
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  function handleEditRecipeCancel() {
    startTransition(() => {
      setCurrentRecipe(null);
    });
  }

  function changeCategoryFilter(e) {
    startTransition(() => {
      setCategoryFilter(e.target.value);
    });
  }

  function changeOrder(e) {
    startTransition(() => {
      setOrderBy(e.target.value);
    });
  }

  function lookupCategoryLabel(categoryKey) {
    const categories = {
      breadsSandwichesAndPizza: "Breads, sandwiches and Pizza",
      eggsAndBreakfast: "Eggs and Breakfast",
      dessertsAndBakedGoods: "Desserts and Baked Goods",
      fishAndSeafood: "Fish And Seafood",
      vegetables: "Vegetables",
    };

    const label = categories[categoryKey];

    return label;
  }

  function formatDate(date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getFullYear();
    const dateString = `${day}-${month}-${year}`;

    return dateString;
  }

  return (
    <>
      {/* <AppRouter existingUser={user} handleAddRecipe={handleAddRecipe} /> */}
      <LoginView existingUser={user} />

      <div className="filter">
        <label>
          Category:
          <select
            value={categoryFilter}
            onChange={(e) => changeCategoryFilter(e)}
            required
          >
            <option value=""></option>
            <option value="breadsSandwichesAndPizza">
              Breads, sandwiches and Pizza
            </option>
            <option value="eggsAndBreakfast">Eggs and Breakfast</option>
            <option value="dessertsAndBakedGoods">
              Desserts and Baked Goods
            </option>
            <option value="fishAndSeafood">Fish And Seafood</option>
            <option value="vegetables">Vegetables</option>
          </select>
        </label>
        <label>
          <select value={orderBy} onChange={(e) => changeOrder(e)}>
            <option value="publishDateDesc">
              Publish Date (newest - oldest)
            </option>
            <option value="publishDateAsc">
              Publish Date (oldest - newest)
            </option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="loading" style={{ padding: "32px" }}>
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      ) : null}
      {!isLoading && recipes && recipes.length === 0 ? (
        <h2
          style={{
            textAlign: "center",
            padding: "100px",
            border: "1px solid #2b2b2b",
          }}
        >
          No Recipes Found
        </h2>
      ) : null}
      {!isLoading && recipes && recipes.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            padding: "100px",
            gap: "32px",
          }}
          className=""
        >
          {recipes.map((recipe, id) => {
            // console.log(recipe.isPublished);
            return (
              <div
                key={id}
                className=""
                style={{
                  padding: "32px",
                  border: "1px solid #2b2b2b",
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "24px",
                }}
              >
                {recipe.isPublished === false ? (
                  <div className="unpublished">UNPUBLISHED</div>
                ) : null}
                <h4>{recipe.name}</h4>
                {recipe.imageUrl ? (
                  <div>
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      width="300px"
                    />
                  </div>
                ) : null}
                <p>Category: {lookupCategoryLabel(recipe.category)}</p>
                <p>Publish Date: {formatDate(recipe.publishDate)}</p>
                {user ? (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => handleEditRecipeClick(recipe.id)}
                  >
                    Edit
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
      {isLoading || (recipes && recipes.length > 0) ? (
        <div
          className="loading-filters"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <label>
            Recipes Per Page: &nbsp;&nbsp;&nbsp;
            <select
              value={recipesPerPage}
              onChange={handleRecipesPerPageChange}
            >
              <option value="3">3</option>
              <option value="6">6</option>
              <option value="9">9</option>
            </select>
          </label>
          <div>
            <button
              type="button"
              className="primary-btn"
              onClick={handleLoadMoreRecipesClick}
            >
              Load more recipes
            </button>
          </div>
        </div>
      ) : null}
      {user ? (
        <AddEditRecipeForm
          existingRecipe={currentRecipe}
          handleAddRecipe={handleAddRecipe}
          handleUpdateRecipe={handleUpdateRecipe}
          handleDeleteRecipe={handleDeleteRecipe}
          handleEditRecipeCancel={handleEditRecipeCancel}
        />
      ) : null}
    </>
  );
}

export default App;
