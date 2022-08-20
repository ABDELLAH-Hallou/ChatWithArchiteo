import json
import string
import random
import nltk
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import numpy as np
from nltk.stem import WordNetLemmatizer
import tensorflow as tf
# Sequential groups a linear stack of layers into a tf.keras.Model
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Dropout

nltk.download("punkt")  # required package for tokenization
nltk.download("wordnet")  # word database
nltk.download('omw-1.4')





def preprocessing(data):
    lm = WordNetLemmatizer()  # object for getting words
    # lists
    classes = []
    words = []
    documentX = []
    documentY = []

    # Each intent is tokenized into words and the patterns and their associated tags are added to their respective lists.
    for intent in data["intents"]:
        for pattern in intent["patterns"]:
            # tokenize the patterns (split)
            tokens = nltk.word_tokenize(pattern)
            words.extend(tokens)  # extends the tokens (add as list)
            documentX.append(pattern)  # collect inputs
            documentY.append(intent["tag"])  # collect targets

        if intent["tag"] not in classes:  # add unexisting tags to their respective classes
            classes.append(intent["tag"])

    # set words to lowercase if not in punctuation
    words = [lm.lemmatize(word.lower())
             for word in words if word not in string.punctuation]
    words = sorted(set(words))  # sorting words
    classes = sorted(set(classes))  # sorting classes
    return classes, words, documentX, documentY, lm


def prepareTrainingData(classes, words, documentX, documentY, lm):
    trainingData = []  # training list array
    outEmpty = [0] * len(classes)
    # bow model
    for idx, doc in enumerate(documentX):
        bagOfwords = []
        text = lm.lemmatize(doc.lower())
        for word in words:
            bagOfwords.append(1) if word in text else bagOfwords.append(0)

        outputRow = list(outEmpty)
        outputRow[classes.index(documentY[idx])] = 1
        trainingData.append([bagOfwords, outputRow])

    random.shuffle(trainingData)
    # coverting our data into an array afterv shuffling
    trainingData = np.array(trainingData, dtype=object)
    x = np.array(list(trainingData[:, 0]))
    y = np.array(list(trainingData[:, 1]))
    return x, y, lm


def modeling(x, y):
    iShape = (len(x[0]),)
    oShape = len(y[0])
    model = Sequential()
    model.add(Dense(128, input_shape=iShape, activation="relu"))
    model.add(Dropout(0.2))
    model.add(Dense(oShape, activation="softmax"))
    model.compile(
        loss='categorical_crossentropy',
        optimizer='adam',
        metrics=["accuracy"]
    )
    print(model.summary())
    history = model.fit(x, y, epochs=500, batch_size=50, verbose=1)
    joblib.dump(model, "../model/data.pkl")
    return model, history


with open('../data/data.json', encoding="utf-8") as json_file:
    data = json.load(json_file)

classes, words, documentX, documentY, lm = preprocessing(data)
joblib.dump(classes, "../model/tags.pkl")
joblib.dump(words, "../model/words.pkl")
x, y, lm = prepareTrainingData(classes, words, documentX, documentY, lm)
model, history = modeling(x, y)


plt.figure()
plt.plot(range(500,), history.history['loss'], label='training_loss')
plt.legend()
plt.figure()
plt.plot(range(500,), history.history['accuracy'], label='training_accuracy')
plt.legend()
plt.show()
