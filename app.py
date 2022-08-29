import models
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
        return jsonify(result)


@app.route('/cv', methods=['POST', 'GET'])
def postCv():
    if request.method == 'POST':
        if request.files['file']:
            file = request.files['file']
            id = request.form['id']
            file.save(os.path.join('./uploads', file.filename))
            candidature = models.Candidature.query.filter_by(id=id).first()
            candidature.cv = file.filename
            db.session.merge(candidature)
            db.session.commit()
            res='votre condidature est enregistré!'
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
    post_desire = req["type"]
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
        nombre_personnes=None
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
        demande = {"id": user.id,
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




# 
@app.route('/get-candidatures')
def getCandidatures():
    res = {"candidatures": []}
    candidatures=models.Candidature.query.all()
    for candidature in candidatures:
        res['candidatures'].append(
            {
                'id':candidature.id,
                'nombre_anne_exp':candidature.nombre_anne_exp,
                'domaine_exp':candidature.domaine_exp,
                'ex_eployeur':candidature.ex_eployeur,
                'post_desire' : candidature.post_desire,
                'cv':candidature.cv,
                'statut':candidature.statut,

            }


        )
    return json.dumps(res)


@app.route('/candidature-user/<usr_id>', methods=['GET'])

def candidatureUser(usr_id):
    res={'user_candidatures':[]}
    user_candidatures=models.candidat.query.filter_by(id_utilisateur=usr_id).all()
    for user_candidature in user_candidatures:
        candidature=models.Candidature.query.filter_by(id=user_candidature.id_candidature).first()
        res['user_candidatures'].append(
            {
                'id': candidature.id,
                'nombre_anne_exp': candidature.nombre_anne_exp,
                'domaine_exp': candidature.domaine_exp,
                'ex_eployeur': candidature.ex_eployeur,
                'post_desire': candidature.post_desire,
                'cv': candidature.cv,
                'statut': candidature.statut,

            }

        )


    return  json.dumps(res)


@app.route("/get-demandes")
def getDemandes():
    res={'demandes':[]}
    demandes = models.Demande.query.all()
    for demande in demandes:
        res['demandes'].append(
            {
            'id':demande.id,
            'type_service':demande.type_service,
            'type_client':demande.type_client,
            'raison_sociale':demande.raison_sociale,
            'nombre_personnes':demande.nombre_personnes,
            'besoins':demande.besoins,
            'commentaires':demande.commentaires,
            'type_partenariat':demande.type_partenariat,
            'num_recrutement':demande.num_recrutement,
             'statut':demande.statut
            }
        )


    return json.dumps(res)


@app.route('/demande-user/<usr_id>', methods=['GET'])

def demande_user(usr_id):
    res = {'user_demandes': []}
    user_demandes = models.client.query.filter_by(id_utilisateur=usr_id).all()
    for user_demande in user_demandes:
        demande = models.Demande.query.filter_by(id=user_demande.id_demande).first()
        res['user_demande'].append(
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
                'statut': demande.statut
            }


        )

    return json.dumps(res)
@app.route('/get-horaires' , methods=['GET'])
def getHoraires():
    res = {'horaires': []}
    horaires=models.Horaire.query.all()
    for horaire in horaires:
        res['horaires'].append(
            {
                'id':horaire.id,
                'heure':horaire.heure

            }
        )
    return json.dumps(res)

@app.route('/get-horaire/<id>',methods=['GET'])
def getHoraire(id):
    res={}
    horaire=models.Horaire.query.filter_by(id=id).first()
    res['id']=horaire.id
    res['heure']=horaire.heure
    return json.dumps(res)


@app.route('/get-JourRdvs', methods=['GET'])
def getJourRdvs():
    res = {'jours': []}
    jours = models.JourRdv.query.all()
    for jour in jours:
        res['jours'].append(
            {
                'id': jour.id,
                'heure': jour.jour

            }
        )
    return json.dumps(res)


@app.route('/get-JourRdv/<id>', methods=['GET'])
def getJourRdv(id):
    res = {}
    day = models.JourRdv.query.filter_by(id=id).first()
    res['id'] = day.id
    res['heure'] = day.jour
    return json.dumps(res)


@app.route('/post-horaire' , methods=['POST'])
def postHoraire():

    horaire=models.Horaire(id=1,heure="18h")
    models.db.session.add(horaire)
    models.db.session.commit()
    horaire=models.Horaire.query.filter_by(id=horaire.id).first()
    res={
        'id':horaire.id,
         'heure':horaire.heure

    }
    return json.dumps(res)


@app.route('/post-jourRdv', methods=['POST'])
def postjourRdv():
    day = models.JourRdv(id=1, jour="Jeudi")
    models.db.session.add(day)
    models.db.session.commit()
    day = models.Horaire.query.filter_by(id=day.id).first()
    res = {
        'id': day.id,
        'jour': day.heure

    }
    return json.dumps(res)

@app.route('/get-rdv' ,methods='GET')
def getRdv():
    res={'les_rdv':[]}
    rendez_vous=models.RendezVous.query.all()
    for rdv in rendez_vous:
        res['les_rdv'].append(
            {
             'id':rdv.id,
             'id_utilisateur':rdv.id_utilisateur,
             'dateRdv':rdv.dateRdv,
             'typeRdv':rdv.typeRdv
            }
        )
    return json.dumps(res)
@app.route('/user-rdv/<usr_id>' ,methods='GET')
def getRdv(usr_id):
    res={'les_rdv':[]}
    rendez_vous=models.RendezVous.query.filter_by(id_utilisateur=usr_id).all()
    for rdv in rendez_vous:
        res['les_rdv'].append(
            {
             'id':rdv.id,
             'id_utilisateur':rdv.id_utilisateur,
             'dateRdv':rdv.dateRdv,
             'typeRdv':rdv.typeRdv
            }
        )
    return json.dumps(res)

@app.route('/post-rdv',methods=['POST'])

def setRdv():
    rdv = models.RendezVous(id_utilisateur=1, dateRdv='2022-08-29 00:58', typeRdv='rendez vous')
    db.session.add(rdv)
    db.session.commit()
    rdv = models.RendezVous.query.filter_by(id=rdv.id).first()
    res={
        'id':rdv.id,
        'id_utilisateur':rdv.id_utilisateur,
        'dateRdv':rdv.dateRdv,
        'typeRdv':rdv.typeRdv
        }
    return  res

if __name__ == "__main__":
    app.run(debug=True)
