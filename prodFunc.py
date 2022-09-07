import random
import nltk
import numpy as np
import tensorflow as tf

nltk.download("punkt")  # required package for tokenization
nltk.download("wordnet")  # word database
nltk.download('omw-1.4')


def validNumber(phone_number):
    if phone_number.isdigit():
        if len(phone_number) == 10 and int(phone_number[0]) == 0:
            return True
    return False


def candidature():
    stops = ['retour', 'annuler']
    error = {'notContinue': 'Veuillez saisir Continuer pour commencer ou Annuler pour Annuler la candidature',
             'notCorrect': "S'il vous plaît, essaie d'écrire la reponse correctement!"}
    message = """Nous sommes ravi d'accueillir des talents comme vous dans notre entreprise .
Je vais vous poser des questions afin d'enregister votre candidature .
Pour continuer Taper Continuer .
Pour annuler la canidature répondre par Annuler (maintenant ou dans n'importe quelle question ) .
Pour modifier la réponse de la question précédente écrivez Retour .
  """
    questions = {'nom': "Quel est votre nom complet ?",
                 'ann_exp': "combien avez vous d'années d'expériences ?",
                 'employeur': "Qu'il est votre employeur actuel s'il existe ?",
                 'expertise': "Qu'il est votre domaine d'expertise ?",
                 'type': "Est-ce que vous visez un poste précis(Oui/Non), si Oui veuillez le mentionner",
                 'num_tel': "Qu'il est votre numéro de téléphone ?"
                 }
    candidat = {}
    restart = True

    print(message)
    response = input("")

    while (response.lower() != "continuer"):
        if response.lower() == "annuler":
            return None
        print(error['notContinue'])
        response = input("")

    # getting data
    while restart:
        restart = False

        for key, question in questions.items():
            print(question)

            # inputs
            if key == 'ann_exp':
                response = input("")
                # the input should be digit or annuler or retour
                while not response.isdigit() and response.lower() not in stops:
                    print(error['notCorrect'])
                    response = input("")

            elif key == 'num_tel':
                response = input("")
                while not validNumber(
                        response) and response.lower() not in stops:  # the input should be phone number or annuler or retour
                    print(error['notCorrect'])
                    response = input("")

            else:
                response = input("")
            # check inputs
            if response.lower() == "annuler":
                return None
            if response.lower() != "retour":
                candidat[key] = response

            else:
                # restart
                restart = True
                break

    return candidat


def autre(data):
    stops = ['retour', 'annuler']
    error = {'notContinue': 'Veuillez saisir Continuer pour commencer ou Annuler pour Annuler la candidature',
             'notCorrect': "S'il vous plaît, essaie d'écrire la reponse correctement!"}
    message = """
  Vous êtes la pour {} . On va vous poser des questions
  Pour continuer Taper Continuer .
  Pour annuler votre demande, répondre par Annuler (maintenant ou dans n'importe quelle question ) .
  Pour modifier la réponse de la question précédente écrivez Retour .
  """.format(data["service"])
    Utype = ['société', 'societe', 'personne physique', 'pp']
    questions = {"type": "Est-ce que vous êtes société ou personne physique(pp) ?",
                 "nom": "",
                 "nbr_pers": "Combien de personnes bénéficiaires ?",
                 "besoins": "Veuillez spécifier vos besoins",
                 'num_tel': "Quel est votre numéro de téléphone ?",
                 'email': "Quel est votre email professionnel ? ",
                 'adresse': "Quel est votre adresse ?"
                 }
    if (data["service"].lower() == "partenariat"):
        questions["type_part"] = "Quel est le type de votre partenariat ?"

    if (data["service"].lower() in ["consultation", "formation"]):
        questions["domain"] = "Quel est le domain dont vous souhaitez faire la " + \
            data["service"].lower() + "?"

    if (data["service"].lower() == "recrutement"):
        questions["nbr_recrut"] = "Quel est le nombre de personnes à recruter ?"
    questions["commentaires"] = "Ajoutez des commentaires si vous souhaitez"

    print(message)
    response = input("")
    restart = True

    while (response.lower() != "continuer"):
        if response.lower() == "annuler":
            return None
        print(error['notContinue'])
        response = input("")

    # getting data
    while restart:
        restart = False

        for key, question in questions.items():
            print(question)

            # inputs
            if key == 'type':
                response = input("")
                # the input should be societe or ph or annuler or retour
                while response not in Utype and response.lower() not in stops:
                    print(error['notCorrect'])
                    response = input("")
                if (response.lower() == "personne physique" or response.lower() == "pp"):
                    questions["nom"] = "Quel est votre nom complet ?"
                else:

                    questions["nom"] = "Qelle est votre Raison Social ?"
                    questions["nbr_pers"] = "Combien d'employés travaillent dans votre société  ?"

            elif key == 'nbr_pers':
                response = input("")
                # the input should be digit or annuler or retour
                while not response.isdigit() and response.lower() not in stops:
                    print(error['notCorrect'])
                    response = input("")

            elif key == 'num_tel':
                response = input("")
                while not validNumber(
                        response) and response.lower() not in stops:  # the input should be phone number or annuler or retour
                    print(error['notCorrect'])
                    response = input("")

            elif key == 'nbr_recrut':
                response = input("")
                # the input should be digit or annuler or retour
                while not response.isdigit() and response.lower() not in stops:
                    print(error['notCorrect'])
                    response = input("")

            else:
                response = input("")

            # check inputs
            if response.lower() == "annuler":
                return None
            if response.lower() != "retour":
                data[key] = response

            else:
                # restart
                restart = True
                break

    return data


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