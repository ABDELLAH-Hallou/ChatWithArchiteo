import os
from flask_sqlalchemy import SQLAlchemy
from flask import Flask

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:root@localhost/chatbotArchiteo"
# app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://abdellahhallou@architeodbchatbot:Chatbot2@architeodbchatbot.mysql.database.azure.com/chatbotArchiteo"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_AS_ASCII'] = False

app.config['SQLALCHEMY_POOL_TIMEOUT'] = 3600
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 50
db = SQLAlchemy(app)
