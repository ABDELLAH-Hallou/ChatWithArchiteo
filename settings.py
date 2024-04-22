import os
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('username')}:{os.getenv('password')}@localhost/{os.getenv('database')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_AS_ASCII'] = False

app.config['SQLALCHEMY_POOL_TIMEOUT'] = 3600
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 50
db = SQLAlchemy(app)
