import random
import nltk
import numpy as np
# import tensorflow as tf

nltk.download("punkt")  # required package for tokenization
nltk.download("wordnet")  # word database
nltk.download('omw-1.4')

def ourText(text, lm):
    tokens = nltk.word_tokenize(text)
    tokens = [lm.lemmatize(word) for word in tokens]
    return tokens


def wordBag(text, vocab, lm):
    tokens = ourText(text, lm)
    bagOfWords = [0] * len(vocab)
    for w in tokens:
        for idx, word in enumerate(vocab):
            if word == w:
                bagOfWords[idx] = 1
    return np.array(bagOfWords)


def Pclass(text, vocab, labels, lm, model):
    bagOfWords = wordBag(text, vocab, lm)
    result = model.predict(np.array([bagOfWords]))[0]
    print(result)
    thresh = 0.2
    prediction = [[idx, res] for idx, res in enumerate(result) if res > thresh]
    print(prediction)
    if not prediction:
        newList=['what']
    else:
        prediction.sort(key=lambda x: x[1], reverse=True)
        newList = []
        for r in prediction:
            newList.append(labels[r[0]])
    return newList


def getRes(firstlist, fJson):
    tag = firstlist[0]
    if tag == "what":
        return "Désolé, je n'ai pas pu vous comprendre. Veuillez reformuler votre phrase s'il vous plaît."
    listOfIntents = fJson["intents"]
    for i in listOfIntents:
        if i["tag"] == tag:
            result = random.choice(i["responses"])
            break
    return result