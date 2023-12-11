from fastapi import APIRouter, Depends
from pydantic import BaseModel
#from src.api import auth
import sqlalchemy
from src import database as db
from operator import itemgetter
from sqlalchemy.exc import DBAPIError

router = APIRouter(
    prefix="/create",
    tags=["create"],
    #dependencies=[Depends(auth.get_api_key)],
)

class User(BaseModel):
    username: str
    email: str

class Influencer(BaseModel):
    username: str
    email: str



@router.post("/user")
def create_user(new_user: User):
    try:
        with db.engine.begin() as connection:
            id = connection.execute(sqlalchemy.text("""INSERT INTO users (username, email) 
                                                    VALUES (:username, :email) RETURNING id"""), {
                                                        'username': new_user.username,
                                                        'email': new_user.email
                                                    }).scalar_one()
    
        return {'new_user_id': id}
    except DBAPIError as error:
        print(f"Error returned: <<<{error}>>>")

@router.post("/influencer")
def create_influencer(new_user: Influencer):
    try:
        with db.engine.begin() as connection:
            id = connection.execute(sqlalchemy.text("""INSERT INTO influencers (username, email) 
                                                    VALUES (:username, :email) RETURNING id"""), {
                                                        'username': new_user.username,
                                                        'email': new_user.email
                                                    }).scalar_one()
    
        return {'new_influencer_id': id}
    except DBAPIError as error:
        print(f"Error returned: <<<{error}>>>")

