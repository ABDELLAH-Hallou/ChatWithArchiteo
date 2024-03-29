import speech_recognition as sr
# from dateutil import parser
import models
from prodFunc import *
import joblib
import json
# import tensorflow as tf
# import pickle
import os
from keras.models import Sequential, model_from_json
# Sequential groups a linear stack of layers into a tf.keras.Model
# from tensorflow.keras import Sequential
# from tensorflow.keras.layers import Dense, Dropout
from nltk.stem import WordNetLemmatizer
import cloudinary
import cloudinary.uploader
from flask import Flask, render_template, request, jsonify


from datetime import datetime
from flask_cors import CORS, cross_origin
from settings import app, db
CORS(app)


@app.route('/', methods=['POST', 'GET'])
def home():
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
        req = request.get_json()  # get request from client side
        pattern = req["pattern"]
        intents = Pclass(pattern, words, classes, lm, model)
        result = getRes(intents, data)
        # save data
        conversation = {
            "tag": intents,
            "patterns": [pattern],
            "responses": [result]
        }


        # 1. Read file contents
        with open('./data/conversation.json', "r") as file:
            fileData = json.load(file)
        # 2. Update json object
        fileData.append(conversation)
        # 3. Write json file
        with open('./data/conversation.json', "w") as file:
            json.dump(fileData, file)
    # with open('./data/conversation.json', 'a', encoding='utf-8') as f:
    #     if(os.stat('./data/conversation.json').st_size == 0):
    #         f.write(",")
    #     json.dump(conversation, f, ensure_ascii=True, indent=4)
    # end saving data
    return jsonify(result)


@app.route('/cv', methods=['POST', 'GET'])
# @cross_origin()
def postCv():
    if request.method == 'POST':
        if request.files['file']:
            file = request.files['file']
            id = request.form['id']
            # app.logger.info('%s file', file)
            if file:
                # upload_result = cloudinary.uploader.upload(file,
                #                                            resource_type="raw",
                #                                            public_id="home/uploads/"+file.filename)
                # print(upload_result['url'])
                # app.logger.info(upload_result)
                file.save(os.path.join('./uploads', file.filename))
                candidature = models.Candidature.query.filter_by(id=id).first()
                # candidature.cv = upload_result['url']
                candidature.cv = file.filename
                db.session.merge(candidature)
                db.session.commit()
                res = 'votre condidature est enregistré!'
                return jsonify(res)


@app.route('/get-users', methods=['GET'])
def getUsers():
    res = {"users": []}
    users = models.Utilisateur.query.all()
    for user in users:
        res['users'].append(
            {"id": user.id,
             "nom": user.nom,
             "email": user.email,
             "num_tel": user.num_tel,
             "adresse": user.adresse}
        )
    return json.dumps(res)


@app.route('/get-user/<id>', methods=['GET'])
def getUser(id):
    res = {}
    user = models.Utilisateur.query.filter_by(id=id).first()
    if user:
        res = {"id": user.id,
               "nom": user.nom,
               "email": user.email,
               "num_tel": user.num_tel,
               "adresse": user.adresse}
    else:
        res = {"error": 'user not found'}
    return json.dumps(res)


@app.route('/get-user-email/<email>', methods=['GET'])
def getUserByEmail(email):
    res = {}
    user = models.Utilisateur.query.filter_by(email=email).first()
    if user:
        res = {"id": user.id,
               "nom": user.nom,
               "email": user.email,
               "num_tel": user.num_tel,
               "adresse": user.adresse}
    else:
        res = {"error": 'user not found'}
    return json.dumps(res)


@app.route('/post-user', methods=['POST'])
def postUser():
    req = request.get_json()
    nom = req["nom"]
    email = req["email"]
    num_tel = req["num_tel"]
    adresse = req["adresse"]
    print(req)
    user = models.Utilisateur(nom=nom, email=email,
                              num_tel=num_tel, adresse=adresse)
    print(user)
    existingUsers = models.Utilisateur.query.all()
    for existingUser in existingUsers:
        if email == existingUser.email:
            res = {"error": 'user already exists'}
            return json.dumps(res)
    db.session.add(user)
    db.session.commit()
    user = {"id": user.id,
            "nom": user.nom,
            "email": user.email,
            "num_tel": user.num_tel,
            "adresse": user.adresse}
    return json.dumps(user)


@app.route('/post-candidature', methods=['POST'])
def postCandidature():
    exists = False
    req = request.get_json()
    nom = req["nom"]
    email = req["email"]
    num_tel = req["num_tel"]
    adresse = req["adresse"]
    nombre_anne_exp = req["ann_exp"]
    domaine_exp = req["expertise"]
    ex_eployeur = req["employeur"]
    post_desire = req["type_cand"]
    existingUsers = models.Utilisateur.query.all()
    for existingUser in existingUsers:
        if email == existingUser.email:
            exists = True
    candidature = models.Candidature(nombre_anne_exp=nombre_anne_exp, domaine_exp=domaine_exp,
                                     ex_eployeur=ex_eployeur, post_desire=post_desire, cv="", statut='à traiter')
    if not exists:
        user = models.Utilisateur(nom=nom, email=email,
                                  num_tel=num_tel, adresse=adresse)
        user.cnd.append(candidature)
        db.session.add(user)
        db.session.commit()
        candidature = {"id": candidature.id,
                       "userId": user.id,
                       "nom": user.nom,
                       "email": user.email,
                       "num_tel": user.num_tel,
                       "adresse": user.adresse,
                       "ann_exp": nombre_anne_exp,
                       "employeur": ex_eployeur,
                       "expertise": domaine_exp,
                       "type": post_desire
                       }
    else:
        user = models.Utilisateur.query.filter_by(email=email).first()
        user.cnd.append(candidature)
        db.session.merge(user)
        db.session.commit()
        candidature = {"id": candidature.id,
                       "userId": user.id,
                       "nom": user.nom,
                       "email": user.email,
                       "num_tel": user.num_tel,
                       "adresse": user.adresse,
                       "ann_exp": nombre_anne_exp,
                       "employeur": ex_eployeur,
                       "expertise": domaine_exp,
                       "type": post_desire
                       }
    return json.dumps(candidature)


@app.route('/post-demande', methods=['POST'])
def postDemande():
    exists = False
    req = request.get_json()
    nom = req["nom"]
    email = req["email"]
    num_tel = req["num_tel"]
    adresse = req["adresse"]
    type_service = req["service"]
    type_client = req["type"]
    # raison_sociale = None
    # if type_client.lower() in ['société', 'societe']:
    raison_sociale = req["nom"]
    if "nbr_pers" in req:
        nombre_personnes = req["nbr_pers"]
    else:
        nombre_personnes = None
    besoins = req["besoins"]
    domaine = None
    if type_service.lower() in ['consultation', 'formation']:
        domaine = req["domain"]
    type_partenariat = None
    if type_service.lower() == "partenariat":
        type_partenariat = req["type_part"]
    num_recrutement = None
    commentaires = None
    if type_service.lower() == "recrutement":

        num_recrutement = req["nbr_recrut"]
        commentaires = req["commentaires"]
    existingUsers = models.Utilisateur.query.all()
    for existingUser in existingUsers:
        if email == existingUser.email:
            exists = True
    demande = models.Demande(type_service=type_service,
                             type_client=type_client,
                             raison_sociale=raison_sociale,
                             nombre_personnes=nombre_personnes,
                             besoins=besoins,
                             commentaires=commentaires,
                             domaine=domaine,
                             type_partenariat=type_partenariat,
                             num_recrutement=num_recrutement,
                             statut='à traiter')
    if not exists:
        user = models.Utilisateur(nom=nom, email=email,
                                  num_tel=num_tel, adresse=adresse)
        user.clt.append(demande)
        db.session.add(user)
        db.session.commit()
        demande = {"id": demande.id,
                   "userId": user.id,
                   "nom": user.nom,
                   "email": user.email,
                   "num_tel": user.num_tel,
                   "adresse": user.adresse,
                   "service": type_service,
                   "type": type_client,
                   "raison_social": raison_sociale,
                   "nbr_pers": nombre_personnes,
                   "besoins": besoins,
                   "domain": domaine,
                   "type_part": type_partenariat,
                   "nbr_recrut": num_recrutement,
                   "commentaires": commentaires
                   }
    else:
        user = models.Utilisateur.query.filter_by(email=email).first()
        user.clt.append(demande)
        db.session.merge(user)
        db.session.commit()
        demande = {"id": demande.id,
                   "userId": user.id,
                   "nom": user.nom,
                   "email": user.email,
                   "num_tel": user.num_tel,
                   "adresse": user.adresse,
                   "service": type_service,
                   "type": type_client,
                   "raison_social": raison_sociale,
                   "nbr_pers": nombre_personnes,
                   "besoins": besoins,
                   "domain": domaine,
                   "type_part": type_partenariat,
                   "nbr_recrut": num_recrutement,
                   "commentaires": commentaires
                   }
    return json.dumps(demande)


@app.route('/get-horaires', methods=['GET'])
def getHoraires():
    res = {'horaires': []}
    horaires = models.Horaire.query.all()
    for horaire in horaires:
        res['horaires'].append(
            {
                'id': horaire.id,
                'heure': horaire.heure

            }
        )
    return json.dumps(res)


@app.route('/get-JourRdvs', methods=['GET'])
def getJourRdvs():
    res = {'jours': []}
    jours = models.JourRdv.query.all()
    days = {'lundi': 1, 'mardi': 2, 'mercredi': 3,
            'jeudi': 4, 'vendredi': 5, 'samedi': 6, 'dimanche': 0}
    for jour in jours:
        res['jours'].append(
            {
                'id': jour.id,
                'jour': jour.jour,
                'number': days[jour.jour.lower()]

            }
        )
    return json.dumps(res)


@app.route('/post-rdv', methods=['POST'])
def postRdv():
    req = request.get_json()
    res = {}
    userId = req['id_utilisateur']
    date = req['dateRdv']
    typeRdv = req['typeRdv']
    date = datetime.strptime(date, '%Y-%m-%d %H:%M')
    print(date)
    Rdv = models.RendezVous(id_utilisateur=userId,
                            dateRdv=date, typeRdv=typeRdv)
    db.session.add(Rdv)
    db.session.commit()
    res = {
        'id': Rdv.id,
        'id_utilisateur': Rdv.id_utilisateur,
        'dateRdv': str(Rdv.dateRdv),
        'typeRdv': Rdv.typeRdv.value
    }
    return json.dumps(res)


@app.route('/get-rdvs', methods=['GET'])
def getRdvs():
    res = {'les_rdv': []}
    rendez_vous = models.RendezVous.query.all()
    for rdv in rendez_vous:
        res['les_rdv'].append(
            {
                'id': rdv.id,
                'id_utilisateur': rdv.id_utilisateur,
                'dateRdv': str(rdv.dateRdv),
                'typeRdv': rdv.typeRdv.value
            }
        )
    return json.dumps(res)


@app.route('/vocal', methods=['POST'])
def postVcl():
    if request.method == 'POST':
        if request.files['vcl']:
            AUDIO_FILE = request.files['vcl']
            print(AUDIO_FILE)
            r = sr.Recognizer()
            with sr.AudioFile(AUDIO_FILE) as source:
                r.adjust_for_ambient_noise(source, duration=0.2)
                audio = r.record(source)
            MyText = r.recognize_google(audio, language='fr-FR')
            MyText = MyText.lower()
            print(MyText)
            res = MyText
            return jsonify(res)


@app.route('/postQuestion', methods=['POST'])
def postQuestion():
    Res = []
    req = request.get_json()
    questionContent = req["question"]
    tag = req["tag"]
    serviceNames = req["service"]
    for serviceName in serviceNames:
        SerExists = False
        QueExists = False
        existingServices = models.Service.query.all()
        existingQuestions = models.Question.query.all()
        for existingService in existingServices:
            if serviceName == existingService.serviceName:
                SerExists = True
        for existingQuestion in existingQuestions:
            print(questionContent, existingQuestion.question)
            if questionContent == existingQuestion.question:
                QueExists = True
        if QueExists and SerExists:
            question = models.Question.query.filter_by(
                question=questionContent).first()
            service = models.Service.query.filter_by(
                serviceName=serviceName).first()
        elif (not SerExists) and (not QueExists):
            service = models.Service(serviceName=serviceName)
            question = models.Question(question=questionContent, tag=tag)
        elif (not SerExists):
            service = models.Service(serviceName=serviceName)
            question = models.Question.query.filter_by(
                question=questionContent).first()
        elif (not QueExists):
            question = models.Question(question=questionContent, tag=tag)
            service = models.Service.query.filter_by(
                serviceName=serviceName).first()
        service.questionPerService.append(question)
        db.session.add(service)
        db.session.commit()
        Res.append({"id": question.id,
                    "serviceId": service.id,
                    "serviceName": service.serviceName,
                    "question": questionContent,
                    "tag": tag
                    })
    return json.dumps(Res)


@app.route('/service-questions/<serviceName>', methods=['GET'])
def serviceQuestions(serviceName):
    res = {'questions': []}
    service = models.Service.query.filter_by(serviceName=serviceName).first()
    questions = service.questionPerService
    for question in questions:
        print(question.ordre)
        res['questions'].append(
            {
                'ordre': question.ordre,
                'tag': question.tag,
                'content': question.question

            }

        )

    return json.dumps(res, ensure_ascii=False)
#


@app.route('/get-candidatures', methods=['GET'])
def getCandidatures():
    res = {"candidatures": []}
    candidatures = models.Candidature.query.all()
    for candidature in candidatures:
        res['candidatures'].append(
            {
                'id': candidature.id,
                'nombre_anne_exp': candidature.nombre_anne_exp,
                'domaine_exp': candidature.domaine_exp,
                'ex_eployeur': candidature.ex_eployeur,
                'post_desire': candidature.post_desire,
                'cv': candidature.cv,
                'statut': candidature.statut.value,

            }


        )
    return json.dumps(res)


@app.route('/candidature-user/<usr_id>', methods=['GET'])
def candidatureUser(usr_id):
    res = {'user_candidatures': []}
    user = models.Utilisateur.query.filter_by(id=usr_id).first()
    candidatures = user.cnd
    for candidature in candidatures:

        res['user_candidatures'].append(
            {
                'id': candidature.id,
                'nombre_anne_exp': candidature.nombre_anne_exp,
                'domaine_exp': candidature.domaine_exp,
                'ex_eployeur': candidature.ex_eployeur,
                'post_desire': candidature.post_desire,
                'cv': candidature.cv,
                'statut': candidature.statut.value,

            }

        )

    return json.dumps(res)


@app.route("/get-demandes", methods=['GET'])
def getDemandes():
    res = {'demandes': []}
    demandes = models.Demande.query.all()
    for demande in demandes:
        res['demandes'].append(
            {
                'id': demande.id,
                'type_service': demande.type_service,
                'type_client': demande.type_client,
                'raison_sociale': demande.raison_sociale,
                'nombre_personnes': demande.nombre_personnes,
                'besoins': demande.besoins,
                'commentaires': demande.commentaires,
                'type_partenariat': demande.type_partenariat,
                'num_recrutement': demande.num_recrutement,
                'statut': demande.statut.value
            }
        )

    return json.dumps(res)


@app.route('/demande-user/<usr_id>', methods=['GET'])
def demande_user(usr_id):
    res = {'user_demandes': []}
    user = models.Utilisateur.query.filter_by(id=usr_id).first()
    demandes = user.clt
    for demande in demandes:
        res['user_demandes'].append(
            {
                'id': demande.id,
                'type_service': demande.type_service,
                'type_client': demande.type_client,
                'raison_sociale': demande.raison_sociale,
                'nombre_personnes': demande.nombre_personnes,
                'besoins': demande.besoins,
                'commentaires': demande.commentaires,
                'type_partenariat': demande.type_partenariat,
                'num_recrutement': demande.num_recrutement,
                'statut': demande.statut.value
            }


        )

    return json.dumps(res)


@app.route('/get-horaire/<id>', methods=['GET'])
def getHoraire(id):
    res = {}
    horaire = models.Horaire.query.filter_by(id=id).first()
    res['id'] = horaire.id
    res['heure'] = horaire.heure
    return json.dumps(res)


@app.route('/get-JourRdv/<id>', methods=['GET'])
def getJourRdv(id):
    res = {}
    day = models.JourRdv.query.filter_by(id=id).first()
    res['id'] = day.id
    res['heure'] = day.jour
    return json.dumps(res)


@app.route('/post-horaire', methods=['POST'])
def postHoraire():
    req = request.get_json()
    id = req["id"]
    heure = req["heure"]
    horaire = models.Horaire(id=id, heure=heure)
    models.db.session.add(horaire)
    models.db.session.commit()
    horaire = models.Horaire.query.filter_by(id=horaire.id).first()
    res = {
        'id': horaire.id,
        'heure': horaire.heure

    }
    return json.dumps(res)


@app.route('/post-jourRdv', methods=['POST'])
def postjourRdv():
    req = request.get_json()
    id = req["id"]
    jour = req["jour"]
    day = models.JourRdv(id=id, jour=jour)
    models.db.session.add(day)
    models.db.session.commit()
    day = models.JourRdv.query.filter_by(id=id).first()
    res = {
        'id': day.id,
        'jour': day.jour

    }
    return json.dumps(res)


@app.route('/user-rdv/<usr_id>', methods=['GET'])
def getuserRdv(usr_id):
    res = {'les_rdv': []}
    rendez_vous = models.RendezVous.query.filter_by(
        id_utilisateur=usr_id).all()
    for rdv in rendez_vous:
        res['les_rdv'].append(
            {
                'id': rdv.id,
                'id_utilisateur': rdv.id_utilisateur,
                'dateRdv': str(rdv.dateRdv),
                'typeRdv': rdv.typeRdv.value
            }
        )
    return json.dumps(res)


if __name__ == "__main__":
    app.run(debug=True)
