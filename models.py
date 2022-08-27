from app import db
from datetime import datetime
from sqlalchemy_utils import EmailType, ChoiceType

# commands to generate data base
# second open cmd, then go to the path where app.py and models exist
# whrite this : 
    # python 
        # >>> from models import db
        # >>> from models import Utilisateur, Candidature, Demande, RendezVous, Horaire, JourRdv
        # >>> db.create_all()


candidat = db.Table('candidat',
    db.Column('id_utilisateur', db.Integer, db.ForeignKey('utilisateur.id'), primary_key=True),
    db.Column('id_candidature', db.Integer, db.ForeignKey('candidature.id'), primary_key=True)
)
client = db.Table('client',
    db.Column('id_utilisateur', db.Integer, db.ForeignKey('utilisateur.id'), primary_key=True),
    db.Column('id_demande', db.Integer, db.ForeignKey('demande.id'), primary_key=True)
)


class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'
    id = db.Column(db.Integer, primary_key=True)
    nom =db.Column(db.String(100), nullable=False)
    email =db.Column(EmailType, nullable=False)
    num_tel =db.Column(db.Text, nullable=False)
    adresse = db.Column(db.Text, nullable=False )
    rdv = db.relationship('RendezVous', backref='utilisateur')
    cnd = db.relationship('Candidature', secondary=candidat, backref='utilisateur')
    clt = db.relationship('Demande', secondary=client, backref='utilisateur')


class Candidature(db.Model):
    __tablename__ = 'candidature'
    # id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), unique=True, nullable=False, primary_key=True)  # True one to one relationship (Implicit child)
    id = db.Column(db.Integer, primary_key=True)
    # id_utilisateur = db.Column(db.Integer, nullable=False)
    nombre_anne_exp = db.Column(db.Integer, nullable=True )
    domaine_exp =db.Column(db.Text, nullable=False)
    ex_eployeur =db.Column(db.String(100), nullable=True)
    post_desire= db.Column(db.String(100), nullable=True)
    cv= db.Column(db.Text, nullable=False)
    STATUSTYPES = [
        ('à traiter', 'A traiter'),
        ('entretien', 'Entretien'),
        ('rejeté', 'Rejete'),
        ('accepté', 'Accepte')
    ]
    statut = db.Column(ChoiceType(STATUSTYPES))


class Demande(db.Model):
    __tablename__ = 'demande'
    # id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), unique=True, nullable=False, primary_key=True)  # True one to one relationship (Implicit child)
    id = db.Column(db.Integer, primary_key=True)
    # id_utilisateur =db.Column(db.Integer, nullable=False)
    type_service =db.Column(db.Text, nullable=True)
    type_client =db.Column(db.Text, nullable=True)
    raison_sociale =db.Column(db.String(100), nullable=True)
    nombre_personnes = db.Column(db.Integer, nullable=True )
    besoins =db.Column(db.Text, nullable=True)
    commentaires =db.Column(db.Text, nullable=True)
    type_partenariat= db.Column(db.String(100), nullable=True)
    num_recrutement = db.Column(db.Integer, nullable=True )
    STATUSTYPES = [
        ('à traiter', 'A traiter'),
        ('rendez vous', 'Rdv'),
        ('rejeté', 'Rejete'),
        ('accepté', 'Accepte')
    ]
    statut = db.Column(ChoiceType(STATUSTYPES))

class RendezVous(db.Model):
    __tablename__ = 'rendezVous'
    id = db.Column(db.Integer, primary_key=True)
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateur.id'),nullable=False)
    # id_utilisateur =db.Column(db.Integer, nullable=False)
    dateRdv =db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    RDVTYPES = [
        ('entretien', 'Entretien'),
        ('rendez vous', 'Rdv')
    ]
    typeRdv = db.Column(ChoiceType(RDVTYPES))
    

class Horaire(db.Model):
    __tablename__ = 'horaire'
    id = db.Column(db.Integer, primary_key=True)
    heure =db.Column(db.Text, nullable=False)

class JourRdv(db.Model):
    __tablename__ = 'jourRdv'
    id = db.Column(db.Integer, primary_key=True)
    jour =db.Column(db.String(100), nullable=False)