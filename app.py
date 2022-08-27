from prodFunc import *
import joblib
import json
import tensorflow as tf
import pickle
import os
from tensorflow.keras.models import Sequential, model_from_json
# Sequential groups a linear stack of layers into a tf.keras.Model
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Dropout
from nltk.stem import WordNetLemmatizer

from flask_restful import Resource, Api
from flask import Flask, render_template, request, jsonify

from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:root@localhost/chatbotArchiteo"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

api = Api(app)
app.config['JSON_AS_ASCII'] = False

@app.route('/', methods=['POST', 'GET'])
def getResponse():
    if request.method == 'POST':
        if request.files['file']:
            file = request.files['file']
            print(file)
            file.save(os.path.join('./uploads', file.filename))
            return 'done'
    else:
        return render_template('chatbot.html')

@app.route('/chat', methods=['POST', 'GET'])
def chat():
    if request.method == 'POST':
        with open("./model/words.pkl", "rb") as f:
            words = joblib.load(f)
        with open("./model/tags.pkl", "rb") as f:
            classes = joblib.load(f)
        # load json and create model
        json_file = open('./model/model.json', 'r')
        loaded_model_json = json_file.read()
        json_file.close()
        model = model_from_json(loaded_model_json)
        # load weights into new model
        model.load_weights("./model/model.h5")
        with open('./data/data.json', encoding="utf-8") as json_file:
            data = json.load(json_file)
        
        lm = WordNetLemmatizer()
        req = request.get_json() #get request from client side
        pattern = req["pattern"]
        intents = Pclass(pattern, words, classes, lm, model)
        result = getRes(intents, data)
        return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
