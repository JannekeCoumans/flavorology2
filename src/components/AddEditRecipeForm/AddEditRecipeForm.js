import { useEffect, useState } from "react";
import { ImageUploadPreview } from "config/C4";

const AddEditRecipeForm = ({
  existingRecipe,
  handleAddRecipe,
  handleUpdateRecipe,
  handleDeleteRecipe,
  handleEditRecipeCancel,
}) => {
  useEffect(() => {
    if (existingRecipe) {
      setName(existingRecipe.name);
      setCategory(existingRecipe.category);
      setDirections(existingRecipe.directions);
      setPublishDate(existingRecipe.publishDate.toISOString().split("T")[0]);
      setIngredients(existingRecipe.ingredients);
      setImageUrl(existingRecipe.imageUrl);
    } else {
      resetForm();
    }
  }, [existingRecipe]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [directions, setDirections] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleRecipeFormSubmit = (e) => {
    e.preventDefault();

    if (ingredients.length === 0) {
      alert("ingredient cannot be empty");
      return;
    }

    if (!imageUrl) {
      alert("Missing recipe image. Please add a recipe image.");
      return;
    }

    const isPublished = new Date(publishDate) <= new Date() ? true : false;

    const newRecipe = {
      name,
      category,
      directions,
      publishDate: new Date(publishDate),
      isPublished,
      ingredients,
      imageUrl,
    };

    if (existingRecipe) {
      handleUpdateRecipe(newRecipe, existingRecipe.id);
    } else {
      handleAddRecipe(newRecipe);
    }

    resetForm();
  };

  const handleAddIngredient = (e) => {
    if (e.key && e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    if (!ingredientName) {
      alert("Missing ingredient, please check");
      return;
    }

    setIngredients([...ingredients, ingredientName]);
    setIngredientName("");
  };

  function resetForm() {
    setName("");
    setCategory("");
    setDirections("");
    setPublishDate("");
    setIngredients([]);
    setImageUrl("");
  }

  return (
    <form
      onSubmit={handleRecipeFormSubmit}
      style={{
        maxWidth: "600px",
        padding: "4rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {existingRecipe ? <h2>Update the Recipe</h2> : <h2>Add a new Recipe</h2>}
      <div>
        Recipe Image
        <ImageUploadPreview
          basePath="recipes"
          existingImageUrl={imageUrl}
          handleUploadFinish={(downloadUrl) => setImageUrl(downloadUrl)}
          handleUploadCancel={() => setImageUrl("")}
        />
      </div>
      <label htmlFor="" className="input-label">
        Recipe name:
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label htmlFor="" className="input-label">
        Category:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
      <label htmlFor="" className="input-label">
        Directions:
        <textarea
          name=""
          id=""
          required
          value={directions}
          onChange={(e) => setDirections(e.target.value)}
        ></textarea>
      </label>
      <label htmlFor="" className="input-label">
        Publish Date:
        <input
          type="date"
          required
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
        />
      </label>
      <div className="ingredients-list">
        <h3>Ingredients</h3>
        <table style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <th
                style={{ padding: "16px", borderBottom: "1px solid #2b2b2b" }}
              >
                Ingrdient
              </th>
              <th
                style={{ padding: "16px", borderBottom: "1px solid #2b2b2b" }}
              >
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredients && ingredients.length > 0
              ? ingredients.map((ingredient) => {
                  return (
                    <tr key={ingredient}>
                      <td
                        style={{
                          padding: "16px",
                        }}
                      >
                        {ingredient}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                        }}
                      >
                        <button type="button" className="no-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>

        {ingredients && ingredients.length === 0 ? (
          <h3>No ingredients added yet.</h3>
        ) : null}

        <label>
          Ingredient:
          <input
            type="text"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            onKeyDown={handleAddIngredient}
            placeholder="ex. 1 cup of sugar"
            style={{ marginLeft: "20px" }}
          />
        </label>
        <button
          type="button"
          className="btn inverse"
          style={{ marginTop: "50px" }}
          onClick={handleAddIngredient}
        >
          {" "}
          Add Ingredient{" "}
        </button>
      </div>
      <div className="btn-wrapper">
        <button type="submit" className="primary-btn">
          {existingRecipe ? "Update Recipe" : "Create Recipe"}
        </button>
        {existingRecipe ? (
          <>
            <button
              type="button"
              onClick={handleEditRecipeCancel}
              className="primary-btn outline"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleDeleteRecipe(existingRecipe.id)}
              className="primary-btn outline"
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
};

export default AddEditRecipeForm;
