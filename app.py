from prodFunc import *
import joblib
import json
import tensorflow as tf
import pickle
from tensorflow.keras.models import Sequential, model_from_json
# Sequential groups a linear stack of layers into a tf.keras.Model
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Dropout
from nltk.stem import WordNetLemmatizer
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
print(words)
while True:
    newMessage = input("")
    intents = Pclass(newMessage, words, classes, lm, model)
    result = getRes(intents, data)
    if result == "consultation" or result == "recrutement" or result == "délocalisation" or result == "formation" or result == "Startupping":
        selectedService = {"service": result}
        print(autre(selectedService))
    elif result == "candidature":
        print(candidature())
    print(result)
