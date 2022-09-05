function autre(service) {
    clientRes["service"] = service;
    stops = ['retour', 'annuler'];
    error = {
        'notContinue': 'Veuillez saisir Continuer pour commencer ou Annuler pour Annuler la candidature',
        'notCorrect': "S'il vous plaît, essaie d'écrire la reponse correctement!"
    };
    message = "Vous êtes la pour " + service + ". On va vous poser des questions. Pour continuer Taper Continuer . Pour annuler votre demande, répondre par Annuler (maintenant ou dans n'importe quelle question ) .  Pour modifier la réponse de la question précédente écrivez Retour .";
    questions = {
        "type": "Est-ce que vous êtes société ou personne physique(pp) ?",
        "nom": "",
        "nbr_pers": "Combien de personnes bénéficiaires ?",
        "besoins": "Veuillez spécifier vos besoins",
        'num_tel': "Quel est votre numéro de téléphone ?",
        'email': "Quel est votre email professionnel ? ",
        'adresse': "Quel est votre adresse ?"
    };
    if (service.toLowerCase() == "partenariat") {
        questions["type_part"] = "Quel est le type de votre partenariat ?";
        clientArr = ['type', 'nom', 'nbr_pers', 'besoins', 'num_tel', 'email', 'adresse', 'type_part'];
        // if (!clientArr.includes('type_part')) {
        //     clientArr.push('type_part');
        // }

    } else
        if (["consultation", "formation"].includes(service.toLowerCase())) {
            questions["domain"] = "Quel est le domain dont vous souhaitez faire la " + service.toLowerCase() + "?";
            clientArr = ['type', 'nom', 'nbr_pers', 'besoins', 'num_tel', 'email', 'adresse', 'domain'];
            // if (!clientArr.includes('domain')) {
            //     clientArr.push('domain');
            // }
        } else
            if (service.toLowerCase() == "recrutement") {
                clientArr = ['type', 'nom', 'besoins', 'num_tel', 'email', 'adresse', 'nbr_recrut', 'commentaires'];
                delete questions.nbr_pers;
                // if(clientArr.includes('domain')){
                //     clientArr.splice(clientArr.indexOf("domain"), 1);
                // }
                // if (clientArr.includes('nbr_pers')) {
                //     clientArr.splice(clientArr.indexOf("nbr_pers"), 1);
                // }
                questions["nbr_recrut"] = "Quel est le nombre de personnes à recruter ?";
                questions["commentaires"] = "Ajoutez des commentaires si vous souhaitez";
                // if (!clientArr.includes('nbr_recrut') && !clientArr.includes('commentaires')) {
                //     clientArr.push('nbr_recrut');
                //     clientArr.push('commentaires');
                // }
            } else
                clientArr = ['type', 'nom', 'nbr_pers', 'besoins', 'num_tel', 'email', 'adresse'];
    return { "questions": questions, "message": message, "error": error, "stops": stops };
}


// function autre
function filloutA(it) {
    var clientmsg = document.getElementById("message").value;
    postDemande(it, clientmsg);
}
function postDemande(it, clientmsg){
    console.log("arr", clientArr);
    if (it + 1 < clientArr.length) {
        var key = clientArr[it + 1];
        console.log("key: ", key);
        // var clientmsg = document.getElementById("message").value;
        var Autre = autre(clientService);
        if (it < 0 && clientmsg.toLowerCase() != "continuer") {
            fromUser(clientmsg);
            if (clientmsg.toLowerCase() == "annuler") {

                document.getElementById('sendBtnA').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                fromChat('votre condidature est annulée');
                candItt = -2;
            } else {
                fromChat(Autre.error['notContinue']);
                candItt--;
            }

        } else {
            if (clientmsg.toLowerCase() != "retour") {
                var question = Autre.questions[key];
                clientRes[key] = "";
                if (clientRes[clientArr[it]] === undefined) {
                    fromUser(clientmsg);
                    fromChat(question);
                }
                else {
                    if (clientmsg.toLowerCase() == "annuler") {
                        document.getElementById('sendBtnA').style.display = "none";
                        document.getElementById('sendBtn').style.display = "block";
                        fromUser(clientmsg);
                        fromChat('votre demande est annulée');
                        candItt = -2;
                    }
                    else {
                        fromUser(clientmsg);
                        clientRes[clientArr[it]] = clientmsg;

                        if (["personne physique", "pp"].includes(clientRes['type'].toLowerCase())) {
                            Autre.questions['nom'] = "Quel est votre nom complet ?";
                            question = Autre.questions[key];
                            fromChat(question);
                        }
                        if (["société", "societe"].includes(clientRes['type'].toLowerCase())) {
                            Autre.questions['nom'] = "Qelle est votre Raison Social ?";
                            Autre.questions["nbr_pers"] = "Combien d'employés travaillent dans votre société  ?";
                            question = Autre.questions[key];
                            fromChat(question);
                        }
                        if (!["société", "societe"].includes(clientRes['type'].toLowerCase()) && !["personne physique", "pp"].includes(clientRes['type'].toLowerCase())) {
                            Autre.questions['nom'] = "Qelle est votre Raison Social ?";
                            Autre.questions["nbr_pers"] = "Combien d'employés travaillent dans votre société  ?";
                            candItt--;
                            fromChat(Autre.questions['type']);
                        }

                    }
                }




            } else {
                clientRes = {};
                candItt = -1;
                var key = clientArr[candItt + 1];
                var question = Autre.questions[key];
                clientRes[key] = "";
                fromUser(clientmsg);
                fromChat(question);
            }
        }
    }
    else {
        if (it + 1 == clientArr.length && clientmsg != "retour") {
            var key = clientArr[it];
            // var clientmsg = document.getElementById("message").value;
            var Autre = autre(clientService);
            if (clientmsg.toLowerCase() == "annuler") {
                document.getElementById('sendBtnA').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                candItt = -2;
                fromUser(clientmsg);
                fromChat('votre demande est annulée');
            }
            else {
                fromUser(clientmsg);
                clientRes[key] = clientmsg;
                var div = document.getElementById("chat");
                var Gdiv = document.getElementById("chat-content");
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + "Cliquer sur le button pour choisir un créneau qui vous convient" + '</p>' +
                    '</div>' + '</div>'
                    + '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + "les créneaux disponibles sont Lundi et Jeudi à 10:00, 15:00 et 17:00" + '</p>' +
                    '</div>' + '</div>'
                    + '<button class="rdvBtn" id="rdvBtn" onclick="rdvBtn();" role="button">Cliquer ici</button> ';
                Gdiv.scroll(0, Gdiv.scrollHeight);
                candItt = -1;
                document.getElementById('sendBtnA').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                var dataToString = JSON.stringify(clientRes);
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", "/post-demande", true);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                        if (xmlhttp.status == 200) {
                            console.log(xmlhttp.responseText);
                            res = JSON.parse(xmlhttp.responseText);
                            userId = res.userId;
                        } else if (xmlhttp = 400) {
                            alert('There was an error status = 400');
                        } else {
                            alert('something else other than 200 was returned');
                        }
                    }
                };
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlhttp.send(dataToString);
            }

        } else
            if (clientmsg.toLowerCase() == "retour") {
                clientRes = {};
                candItt = -1;
                var key = clientArr[candItt + 1];
                var question = Autre.questions[key];
                clientRes[key] = "";
                fromUser(clientmsg);
                fromChat(question);
            }
    }
    document.getElementById("message").value = "";
}