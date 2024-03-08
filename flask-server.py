# Import the dependencies.
from flask import Flask, jsonify

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from datetime import datetime
import dateutil.relativedelta

import numpy as np


#################################################
# Database Setup
################################################# 

engine = create_engine("sqlite:///Resources/Project-3-Lung-Cancer.sqlite")
# reflect an existing database into a new model 
Base = automap_base()

# reflect the tables
Base.prepare(autoload_with=engine)

# print(Base.classes.keys()) 

# Save references to each table

Cancer = Base.classes.cancer
# print(Cancer.__dict__) 




#################################################
# Flask Setup
#################################################

app = Flask(__name__)
#Create Landing page for website
@app.route("/")
def landing():
    return "Home page for Project 3 Group 6 - Lung Cancer Project"
# Creates cancer route that returns jsonified data of all of the data in the database
@app.route("/raw-lung-cancer-data")    
def cancer():
   # Create our session (link) from Python to the DB
    session = Session(engine)
    cancer_data = session.query(Cancer).all()

    cancer_list = []
    for cancer in cancer_data:
        cancer_dict = cancer.__dict__
        cancer_dict.pop('_sa_instance_state', None)
        cancer_list.append(cancer_dict)
        # print (cancer_dict)
    response = jsonify(cancer_list)
    response.headers.add("Access-Control-Allow-Origin", "*")

    session.close()
    return response

if __name__ == "__main__":
    app.run(debug=True)
