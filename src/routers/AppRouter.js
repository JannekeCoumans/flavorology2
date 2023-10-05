import React from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";

import {
  // AddRecipeView,
  // Nav,
  // HomeView,
  // RecipeOverview,
  // RecipesView,
  // ScrollToTop,
  // ShoppingListView,
  // ComingSoon,
  // FavoritesView,
  // AccountView,
  LoginView,
  // LoginRequiredView,
  // ScrollToTopButton,
  AddEditRecipeForm,
} from "../config/C4";

const AppRouter = ({ existingUser, handleAddRecipe }) => {
  return (
    <Router>
      <LoginView existingUser={existingUser} />
      {existingUser ? (
        <AddEditRecipeForm handleAddRecipe={handleAddRecipe} />
      ) : null}

      {/* <ScrollToTop />
      {existingUser && <Nav />}
      <div id="top" className={existingUser ? "viewContainer" : ""}>
        {existingUser && <ScrollToTopButton scrollToElement="top" />}
        <Switch>
          {existingUser ? (
            <>
              <Route path="/" exact component={HomeView} />
              <Route path="/recepten" exact component={RecipesView} />
              <Route path="/recept-toevoegen" exact component={AddRecipeView} />
              <Route
                path="/recept/:id/:id/:id"
                exact
                component={RecipeOverview}
              />
              <Route
                path="/boodschappenlijstje"
                exact
                component={ShoppingListView}
              />
              <Route path="/onlangs-toegevoegd" exact component={ComingSoon} />
              <Route path="/uitproberen" exact component={ComingSoon} />
              <Route path="/favorieten" exact component={FavoritesView} />
              <Route path="/account" exact component={AccountView} />
            </>
          ) : (
            <>
              <Route
                path="/"
                exact
                render={() => <LoginView existingUser={existingUser} />}
              />
              {window.location.pathname !== "/" && (
                <Route path="*" component={LoginRequiredView} />
              )}
            </>
          )}
        </Switch>
      </div> */}
    </Router>
  );
};

export default AppRouter;
