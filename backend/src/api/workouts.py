from fastapi import APIRouter, Depends
from pydantic import BaseModel
#from src.api import auth
import sqlalchemy
from src import database as db
from operator import itemgetter
from sqlalchemy.exc import DBAPIError

router = APIRouter(
    prefix="/workouts",
    tags=["workouts"],
    #dependencies=[Depends(auth.get_api_key)],
)

class Workout(BaseModel):
    name: str
    description: str
    author_id: int
    difficulty: int
    duration: int
    objective_id: int
    num_days: int

class Exercise(BaseModel):
    name: str
    equipment_id: int
    muscle_group: str

class WorkoutStep(BaseModel):
    workout_id: int
    exercise_id: int
    sets: int
    reps: int
    percent_max_weight: int
    rest_secs: int
    

@router.post("/create")
def create_workout(new_workout: Workout):
    try:
        with db.engine.begin() as connection:
            id = connection.execute(sqlalchemy.text(
                """INSERT INTO workouts (name, description, author_id, difficulty, duration, objective_id, num_days) 
                                                    VALUES (:name, :description, :author_id, :difficulty, :duration, :objective_id, :num_days) RETURNING id"""), {
                                                        'name': new_workout.name,
                                                        'description': new_workout.description,
                                                        'difficulty': new_workout.difficulty,
                                                        'author_id': new_workout.author_id,
                                                        'duration': new_workout.duration,
                                                        'objective_id': new_workout.objective_id,
                                                        'num_days': new_workout.num_days
                                                    }).scalar_one()
    
        return {'new_workout_id': id}
    except DBAPIError as error:
        print(f"Error returned: <<<{error}>>>")




@router.post("/create-exercise")
def create_exercise(new_exercise: Exercise):
    try:
        with db.engine.begin() as connection:
            id = connection.execute(sqlalchemy.text("""INSERT INTO exercises (name, equipment_id, muscle_group) 
                                                    VALUES (:name, :equipment_id, :muscle_group) RETURNING id"""), {
                                                        'name': new_exercise.name,
                                                        'equipment_id': new_exercise.equipment_id,
                                                        'muscle_group': new_exercise.muscle_group,
                                                    }).scalar_one()
    
        return {'new_exercise_id': id}
    except DBAPIError as error:
        print(f"Error returned: <<<{error}>>>")


@router.post("/create-step")
def create_step(new_step: WorkoutStep):
    try:
        with db.engine.begin() as connection:
            id = connection.execute(sqlalchemy.text("""INSERT INTO workout_steps (workout_id, exercise_id, sets, reps, percent_max_weight, rest_secs) 
                                                    VALUES (:workout_id, :exercise_id, :sets, :reps, :percent_max_weight, :rest_secs) RETURNING id"""), {
                                                        'workout_id': new_step.workout_id,
                                                        'exercise_id': new_step.exercise_id,
                                                        'sets': new_step.sets,
                                                        'reps': new_step.reps,
                                                        'percent_max_weight': new_step.percent_max_weight,
                                                        'rest_secs': new_step.rest_secs,
                                                    }).scalar_one()

        return {'new_step_id': id}
    except DBAPIError as error:
        print(f"Error returned: <<<{error}>>>")





@router.get("/{workout_id}")
def create_workout(workout_id):
    try:
        with db.engine.begin() as connection:
            workout = connection.execute(sqlalchemy.text("SELECT * from workouts where id = :id"), {'id': workout_id}).fetchone()
        
        return list(workout)
    except DBAPIError as error:
        print(f"Error returned: <<<{error}>>>")


