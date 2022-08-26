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
from flask_socketio import SocketIO

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
# socketio = SocketIO(app)

# @app.route('/', methods=['POST'])
# def Home():

# with open("./model/words.pkl", "rb") as f:
#     words = joblib.load(f)
# with open("./model/tags.pkl", "rb") as f:
#     classes = joblib.load(f)
# # load json and create model
# json_file = open('./model/model.json', 'r')
# loaded_model_json = json_file.read()
# json_file.close()
# model = model_from_json(loaded_model_json)
# # load weights into new model
# model.load_weights("./model/model.h5")

# with open('./data/data.json', encoding="utf-8") as json_file:
#     data = json.load(json_file)
# lm = WordNetLemmatizer()
# while True:
#     newMessage = input("")
#     intents = Pclass(newMessage, words, classes, lm, model)
#     result = getRes(intents, data)
#     if result == "consultation" or result == "recrutement" or result == "délocalisation" or result == "formation" or result == "Startupping":
#         selectedService = {"service": result}
#         print(autre(selectedService))
#     elif result == "candidature":
#         print(candidature())
#     else:
#         print(result)
# return render_template('index.html')
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
        # get files : 
        # else:
            # with open("./model/words.pkl", "rb") as f:
            #     words = joblib.load(f)
            # with open("./model/tags.pkl", "rb") as f:
            #     classes = joblib.load(f)
            # # load json and create model
            # json_file = open('./model/model.json', 'r')
            # loaded_model_json = json_file.read()
            # json_file.close()
            # model = model_from_json(loaded_model_json)
            # # load weights into new model
            # model.load_weights("./model/model.h5")
            # with open('./data/data.json', encoding="utf-8") as json_file:
            #     data = json.load(json_file)
            
            # lm = WordNetLemmatizer()
            # req = request.get_json() #get request from client side
            # pattern = req["pattern"]
            # intents = Pclass(pattern, words, classes, lm, model)
            # result = getRes(intents, data)
            # return jsonify(result)

        # if result == "consultation" or result == "recrutement" or result == "délocalisation" or result == "formation" or result == "Startupping":
        #     selectedService = {"service": result}
        #     print(autre(selectedService))
        # elif result == "candidature":
        #     print(candidature())
        # else:
        #     print(result)



        # intents=data['intents']
        # tag = ''
        # for intent in intents:
        #     if pattern in intent['patterns']:
        #         tag = intent['tag']
        #         break
        # if tag != '':
        #     print(tag)
        #     return jsonify(tag)
        # else:
        #     print('fuck')
        #     return jsonify({'error': 'data not found'})
    else:
        return render_template('chatbot.html')
# uploads_dir = os.path.join(app.instance_path, 'uploads')
# os.makedirs(uploads_dir, exists_ok=True)
# from werkzeug import secure_filename
# @app.route('/cv', methods=['POST', 'GET'])
# def getFile():
#     if request.method == 'POST':
#         file = request.files['file']
#         print(file)
#         file.save(os.path.join('./uploads', file.filename))

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
