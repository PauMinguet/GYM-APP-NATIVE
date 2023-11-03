# generated by fastapi-codegen:
#   filename:  openapi.yaml
#   timestamp: 2023-10-24T00:41:23+00:00

from __future__ import annotations

from typing import List, Union

from fastapi import FastAPI
from typing import Annotated, Optional
from sqlalchemy.engine import Engine
from fastapi import Depends, FastAPI
from open_recipes.models import Ingredient, Recipe, RecipeList, Review, User, PopulatedRecipe, CreateUserRequest, CreateRecipeListRequest, CreateRecipeRequest, RecipeListResponse
from open_recipes.database import get_engine 
from sqlalchemy import text
import uvicorn

app = FastAPI(
    title='Recipe Service API',
    version='1.0.0',
    description='API for managing recipes, ingredients, users, and reviews.',
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

#TODO: temporarily add user_id parameter to ingredients endpoints. Eventually replace with sessionid
@app.get('/ingredients/', response_model=List[Ingredient])
def get_ingredients(engine : Annotated[Engine, Depends(get_engine)]) -> List[Ingredient]:
    """
    Get all ingredients
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, type, storage, category_id 
                                   FROM ingredient
                                   ORDER BY id"""))
        rows = result.fetchall()
        ingredients = [Ingredient(id=row.id, name=row.name, type=row.type, storage=row.storage, category_id=row.category_id) for row in rows]
        return ingredients

@app.get('/ingredients/{id}', response_model=Ingredient)
def get_ingredient(id : int,engine : Annotated[Engine, Depends(get_engine)]) -> Ingredient:
    """
    Get an ingredient by id
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, type, storage, category_id 
                                   FROM ingredient
                                   WHERE id = :id"""))
        id, name, type, storage, category_id = result.fetchone()
        return Ingredient(id=id, name=name, type=type, storage=storage, category_id=category_id) 

@app.post("/ingredients/{id}")
def update_ingredient(id: int, ingredient : Ingredient ,engine : Annotated[Engine, Depends(get_engine)]) -> Ingredient:
    """
    Update an ingredient by id 
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""UPDATE ingredient 
                                   SET name = :name, type = :type, storage = :storage, category_id = :category_id
                                   WHERE id = :id""",{"name":ingredient.name, "type":ingredient.type, "storage": ingredient.storage, "category_id": ingredient.category_id}))
        id, name, type, storage, category_id = result.fetchone()
        return Ingredient(id=id, name=name, type=type, storage=storage, category_id=category_id) 

@app.delete("/ingredient/{id}")
def delete_ingredient(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> str:
    with engine.begin() as conn:
        conn.execute(text(f"""DELETE FROM ingredient
                            WHERE id = :id""",{"id":id}))
        return "OK" 
 
@app.post('/ingredients', response_model=None, status_code=201, responses={'201': {'model': Ingredient}})
def post_ingredients(body: Ingredient,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, Ingredient]:
    """
    Create a new ingredient
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO ingredient (name, description)
                                    VALUES (:name, :description)
                                    RETURNING id, name, description 
                                   """
                                    ),{"name":body.name,"description":body.description})
        
        id, name, description= result.fetchone()
        return RecipeList(id=id, name=name, description=description)

#SMOKE TESTED
@app.get('/recipe-lists', response_model=List[RecipeList])
def get_recipe_lists(engine : Annotated[Engine, Depends(get_engine)]) -> List[RecipeList]:
    """
    Get all recipe lists
    """
    recipeListAll = []
    with engine.begin() as conn:
        result = conn.execute(text(f"SELECT id, name, description FROM recipe_list ORDER BY id"))
        rows = result.fetchall()
        for row in rows: 
            id, name, description = row
            recipe = RecipeList(id=id, name=name, description=description)
            recipeListAll.append(recipe)
        return recipeListAll
@app.post(
    '/recipe-lists', response_model=None, status_code=201, responses={'201': {'model': RecipeList}}
)
def post_recipe_lists(body: CreateRecipeListRequest,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, RecipeList]:
    """
    Create a new recipe list
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO recipe_list (name, description)
                                    VALUES (:name, :description)
                                    RETURNING id, name, description 
                                   """
                                    ),{"name":body.name,"description":body.description})
        
        id, name, description= result.fetchone()
        return RecipeList(id=id, name=name, description=description)

#SMOKE TESTED
@app.get('/recipe-lists/{id}', response_model=RecipeListResponse)
def get_recipe_list(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> RecipeList:
    """
    Get a recipe list by id
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, description FROM recipe_list WHERE id = :recipe_id"""),{"recipe_id": id})
        id, name, description = result.fetchone()
        result = conn.execute(text(f"""SELECT id, name, description, mins_prep, mins_cook, default_servings, author_id, procedure
                                        FROM recipe
                                        JOIN recipe_x_recipe_list AS rl ON rl.recipe_id = recipe.id
                                        WHERE rl.recipe_list_id = :list_id"""),{"list_id": id})
        rows = result.fetchall()
        recipes = [Recipe(id=row.id, name=row.name, description=row.description, mins_prep=row.mins_prep, mins_cook=row.mins_cook, default_servings=row.default_servings, author_id=row.author_id, procedure=row.procedure) for row in rows]
        print(recipes)
        return RecipeListResponse(id=id, name=name, description= description, recipes=recipes)

@app.post("/recipe-lists/{id}")
def update_recipe_list(id: int, recipe_list : RecipeList, engine : Annotated[Engine, Depends(get_engine)]) -> RecipeList:
    with engine.begin() as conn:
        result = conn.execute(text(f"""UPDATE recipe_list 
                                   SET name = :name, description = :description
                                   WHERE id = :id""",{"name":recipe_list.name, "description":recipe_list.description, "id":id}))
        id, name, description = result.fetchone()
        return RecipeList(id=id, name=name, description=description)

@app.delete("/recipe-lists/{id}")
def delete_recipe_list(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as conn:
        result = conn.execute(text(f"""DELETE FROM recipe_list 
                                   WHER
                                   default_servings, procedure FROM "recipe" """))
        id, name, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure = result.fetchone()
        return Recipe(id=id, name=name, mins_prep=mins_prep, category_id=category_id, mins_cook=mins_cook, description=description, author_id=author_id, default_servings=default_servings, procedure=procedure)
 

#TODO: fixme and implement search
@app.get('/recipes', response_model=List[Recipe])
def get_recipes(name: Optional[str], max_time : Optional[int], engine : Annotated[Engine, Depends(get_engine)]) -> List[Recipe]:
    """
    Get all recipes
    """

    print("Name:", name)  # Debug: Print the value of name
    print("Max Time:", max_time)  # Debug: Prin
    #
    if( name == None and max_time == None):
        with engine.begin() as conn:
            result = conn.execute(text(f"""SELECT id, name, mins_prep, category_id, mins_cook, description, author_id, 
                                   default_servings, procedure FROM "recipe" """))
            id, name, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure = result.fetchall()

            return [Recipe(id=id, name=name, mins_prep=mins_prep, category_id=category_id, mins_cook=mins_cook, description=description, author_id=author_id, default_servings=default_servings, procedure=procedure) for id, name, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure in result]
    elif(name != None and max_time == None):
        with engine.begin() as conn:
            result = conn.execute(text(f"""SELECT id, name, mins_prep, category_id, mins_cook, description, author_id, 
                                   default_servings, procedure FROM "recipe" WHERE name ILIKE :name"""), {"name":f"%{name}%"})
            print("Generated SQL Query:", result._saved_cursor.statement)

            id, name, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure = result.fetchall()

            return [Recipe(id=id, name=name, mins_prep=mins_prep, category_id=category_id, mins_cook=mins_cook, description=description, author_id=author_id, default_servings=default_servings, procedure=procedure) for id, name, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure in result]

        
    elif(name == None and max_time != None):
        with engine.begin() as conn:
            result = conn.execute(text(f"""SELECT id, name, mins_prep, category_id, mins_cook, description, author_id, 
                                   default_servings, procedure FROM "recipe" WHERE mins_cook + mins_prep <= :max_time"""), {"max_time":max_time})
            id, name, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure = result.fetchall()
            return Recipe(id=id, name=name, mins_prep=mins_prep, category_id=category_id, mins_cook=mins_cook, description=description, author_id=author_id, default_servings=default_servings, procedure=procedure)

    else:
        with engine.begin() as conn:
            result = conn.execute(text(f"""SELECT id, name, mins_prep, category_id, mins_cook, description, author_id, 
                                   default_servings, procedure FROM "recipe" WHERE mins_cook + mins_prep <= :max_time AND name ILIKE :name"""), {"max_time":max_time, "name": f"%{name}%"})
            id, name, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure = result.fetchall()
            return Recipe(id=id, name=name, mins_prep=mins_prep, category_id=category_id, mins_cook=mins_cook, description=description, author_id=author_id, default_servings=default_servings, procedure=procedure)
            
    

#SMOKE TESTED
#FIXME: increment created at in database
@app.post('/recipes', response_model=None, status_code=201, responses={'201': {'model': CreateRecipeRequest}})
def post_recipes(body: CreateRecipeRequest,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, Recipe]:
    """
    Create a new recipe
    """    
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO recipe (name, mins_prep, mins_cook, description, default_servings, author_id, procedure)
                                   VALUES (
                                   :name,
                                   :mins_prep,
                                   :mins_cook,
                                   :description,
                                   :default_servings,
                                   :author_id,
                                   :procedure)
                                   RETURNING id, name, mins_prep, mins_cook, description, default_servings, author_id, procedure"""
                                   
            ), {"name":body.name,
             "author_id":body.author_id,
             "mins_prep":body.mins_prep,
             "mins_cook":body.mins_cook
             ,"description":body.description,
             "default_servings":body.default_servings,
             "procedure":body.procedure})
        id,name,mins_prep,mins_cook,description,default_servings,author_id,procedure = result.fetchone()
        recipe = Recipe(id=id,name=name,mins_prep=mins_prep,mins_cook=mins_cook,description=description,default_servings=default_servings,author_id=author_id, procedure=procedure)
        return recipe

#SMOKE TESTED
@app.get('/recipes/{id}', response_model=Recipe)
def get_recipe(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> Recipe:
    """
    Get a recipe by id
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, mins_prep, mins_cook, description, default_servings, author_id, procedure FROM recipe WHERE id = :id"""),{"id":id})
        id, name, mins_prep,mins_cook,description,default_servings,author_id,procedure = result.fetchone()
        return Recipe(id=id,name=name,mins_prep=mins_prep,mins_cook=mins_cook,description=description,default_servings=default_servings,author_id=author_id, procedure=procedure)

@app.post("/recipes/{id}", status_code=201, response_model=None)
def update_recipe(id: int, recipe : Recipe,engine : Annotated[Engine, Depends(get_engine)]) -> Recipe:
    pass

@app.delete("/recipes/{id}")
def delete_recipe(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    pass

@app.post('/recipes/{recipe_id}/recipe-lists/{recipe_list_id}', status_code=201, response_model=None)
def add_recipe_to_recipe_list(recipe_id: int, recipe_list_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as conn:
        conn.execute(text(f"INSERT INTO recipe_x_recipe_list (recipe_id, recipe_list_id) VALUES (:recipe_id, :recipe_list_id)"),{"recipe_id":recipe_id,"recipe_list_id":recipe_list_id})
        return "OK"

@app.get('/reviews', response_model=List[Review])
def get_reviews(engine : Annotated[Engine, Depends(get_engine)]) -> List[Review]:
    """
    Get all reviews
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"SELECT id, stars, author_id, content, recipe_id, FROM reviews ORDER BY created_at"))
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)

@app.post('/reviews', response_model=None, responses={'201': {'model': Review}})
def post_reviews(body: Review,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, Review]:
    """
    Create a new review
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"INSERT INTO reviews stars, author_id, content, recipe_id values (:stars,:author_id,:content,:recipe_id)",{"stars":body.stars,"author_id":body.author.id,"content":body.content,"recipe_id":body.recepie.id}))
        id, stars, author_id, content, recipe_id = result.fetchone()
        return User(id=id, stars=stars, author_id=author_id, content=content, recipe_id = recipe_id)

@app.get('/reviews/{id}', response_model=Review)
def get_review(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> Review:
    """
    Get a review by id
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT stars, author_id, content, recipe_id FROM review WHERE id = :id"""),{"id":id})
        id, stars, author_id, content, recipe_id = result.fetchone()
        return Review(id=id, stars=stars, author_id=author_id, content=content, recipe_id = recipe_id)

@app.post("/reviews/{id}")
def update_review(id: int, review : Review,engine : Annotated[Engine, Depends(get_engine)]) -> Review:
    with engine.begin() as conn:
        result = conn.execute(text(f"UPDATE review SET stars = :stars, author_id = :author_id, content = :content, recipe_id = :recipe_id WHERE id = :id",{"stars":review.stars,"author_id":review.author_id, "content":review.content,  "recipe_id":review.recipe_id, "id":id}))
        id, stars, author_id, content, recipe_id = result.fetchone()
        return Review(id=id, stars = stars, author_id = author_id, content = content, recipe_id = recipe_id)

@app.delete("/reviews/{id}")
def delete_review(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as conn:
        result = conn.execute(text(f"""DELETE FROM "reviews" WHERE id = :id""",{"id":id}))
        id, stars, author_id, content, recipe_id = result.fetchone()
        return Review(id=id, stars=stars, author_id=author_id, content=content, recipe_id = recipe_id)

@app.get('/users', response_model=List[User])
def get_users(engine : Annotated[Engine, Depends(get_engine)]) -> List[User]:
    """
    Get all users
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, email, phone FROM "user" ORDER BY id"""))
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)

#SMOKE TESTED
@app.get('/users/{user_id}',response_model=User)
def get_user(user_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[User]:
    """
    Get one user
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, email, phone FROM "user" WHERE id = :user_id"""),{"user_id":user_id})
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)

#SMOKE TESTED
@app.post('/users', response_model=None,status_code=201, responses={'201': {'model': User}})
def post_users(body: CreateUserRequest,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, User]:
    """
    Create a new user
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO "user" (name, email, phone)
                                    VALUES (:name, :email, :phone)
                                    RETURNING id, name, email, phone
                                   """
                                    ),{"name":body.name,"phone":body.phone,"email":body.email})
        
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)

@app.post("/users/{id}")
def update_user(id: int, user : User,engine : Annotated[Engine, Depends(get_engine)]) -> User:

    with engine.begin() as conn:
        result = conn.execute(text(f"UPDATE users SET name = :name, email = :email, phone = :phone WHERE id = :id",{"name":user.name,"phone":user.phone,"email":user.email,"id":id}))
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)

@app.delete("/users/{id}")
def delete_user(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as conn:
        result = conn.execute(text(f"""DELETE FROM "user" WHERE id = :id""",{"id":id}))
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)



import uvicorn

if __name__ == "__main__":
    config = uvicorn.Config(
        app, port=3000, log_level="info", reload=True
    )
    server = uvicorn.Server(config)
    server.run()
