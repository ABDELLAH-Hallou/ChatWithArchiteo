function autre(service, questions) {
    clientRes["service"] = service;
    stops = ['retour', 'annuler'];
    error = {
        'notContinue': 'Veuillez saisir Continuer pour commencer ou Annuler pour Annuler la candidature',
        'notCorrect': "S'il vous plaît, essaie d'écrire la reponse correctement!"
    };
    message = "Vous êtes la pour " + service + ". On va vous poser des questions. Pour continuer Taper Continuer . Pour annuler votre demande, répondre par Annuler (maintenant ou dans n'importe quelle question ) .  Pour modifier la réponse de la question précédente écrivez Retour .";
    // questions = {
    //     "type": "Est-ce que vous êtes société ou personne physique(pp) ?",
    //     "nom": "",
    //     "nbr_pers": "Combien de personnes bénéficiaires ?",
    //     "besoins": "Veuillez spécifier vos besoins",
    //     'num_tel': "Quel est votre numéro de téléphone ?",
    //     'email': "Quel est votre email professionnel ? ",
    //     'adresse': "Quel est votre adresse ?"
    // };
    // if (service.toLowerCase() == "partenariat") {
    //     questions["type_part"] = "Quel est le type de votre partenariat ?";
    //     clientArr = ['type', 'nom', 'nbr_pers', 'besoins', 'num_tel', 'email', 'adresse', 'type_part'];

    // } else
    //     if (["consultation", "formation"].includes(service.toLowerCase())) {
    //         questions["domain"] = "Quel est le domaine dont vous souhaitez faire la " + service.toLowerCase() + "?";
    //         clientArr = ['type', 'nom', 'nbr_pers', 'besoins', 'num_tel', 'email', 'adresse', 'domain'];
    //     } else
    //         if (service.toLowerCase() == "recrutement") {
    //             clientArr = ['type', 'nom', 'besoins', 'num_tel', 'email', 'adresse', 'nbr_recrut', 'commentaires'];
    //             delete questions.nbr_pers;
    //             questions["nbr_recrut"] = "Quel est le nombre de personnes à recruter ?";
    //             questions["commentaires"] = "Ajoutez des commentaires si vous souhaitez";
    //         } else
    //             clientArr = ['type', 'nom', 'nbr_pers', 'besoins', 'num_tel', 'email', 'adresse'];
    clientArr = []
    for (const key in questions) {
        clientArr.push(key);
    }
    console.log(clientArr);
    return { "questions": questions, "message": message, "error": error, "stops": stops };
}


// function autre
function filloutA(it) {
    console.log(clientRes);
    var clientmsg = document.getElementById("message").value;
    if (clientmsg != "") {
        postDemande(it, clientmsg);
        candItt++;
    }
}
function postDemande(it, clientmsg) {
    console.log("arr", clientArr);

    if (it + 1 < clientArr.length) {
        var key = clientArr[it + 1];
        console.log("key: ", key);
        console.log("it: ", it);
        console.log(autre);
        var Autre = JSON.parse(JSON.stringify(autre));
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
                console.log("question : ", question);
                clientRes[key] = "";
                if (clientRes[clientArr[it]] === undefined) {
                    console.log("undif")
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
                        if (clientRes.email !== "" && clientRes.email !== undefined) {
                            var msg = validation_email('clt', clientRes.email);
                            console.log(msg);
                            if (msg != true) {
                                fromChat(msg);
                                document.getElementById("message").value = "";
                                candItt--;
                                return;
                            }
                        }
                        if (["personne physique", "pp"].includes(clientRes['type'].toLowerCase())) {
                            // Autre.questions['nom'] = "Quel est votre nom complet ?";
                            // delete Autre.questions["raisonSocial"];
                            // delete Autre.questions["nb_emp"];
                            console.log(autre.questions["nom"]);
                            Autre.questions["nom"] = autre.questions["nom"];
                            if (clientArr.includes("raisonSocial")) {
                                clientArr.splice(clientArr.indexOf("raisonSocial"), 1);
                                clientArr.splice(clientArr.indexOf("nb_emp"), 1);
                            }
                            question = Autre.questions[key];
                            console.log(question);
                            fromChat(question);
                        }
                        if (["société", "societe"].includes(clientRes['type'].toLowerCase())) {
                            // Autre.questions['nom'] = "Qelle est votre Raison Social ?";
                            // Autre.questions["nbr_pers"] = "Combien d'employés travaillent dans votre société  ?";
                            // question = Autre.questions[key];
                            Autre.questions["nom"] = autre.questions["raisonSocial"];
                            if (clientArr.includes("raisonSocial")) {                                
                                clientArr.splice(clientArr.indexOf("raisonSocial"), 1);
                            }
                            question = Autre.questions[key]
                            console.log(question);
                            fromChat(question);
                        }
                        if (!["société", "societe"].includes(clientRes['type'].toLowerCase()) && !["personne physique", "pp"].includes(clientRes['type'].toLowerCase())) {
                            // Autre.questions['nom'] = "Qelle est votre Raison Social ?";
                            // Autre.questions["nbr_pers"] = "Combien d'employés travaillent dans votre société  ?";
                            candItt--;
                            fromChat(Autre.questions['type']);
                        }

                    }
                }




            } else {
                clientRes = {
                    service:clientRes.service
                };
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
            // var Autre = autre(clientService);
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
                    '<p>' + "les créneaux disponibles sont " + allowedTime().jour + "à " + allowedTime().hour + '</p>' +
                    '</div>' + '</div>'
                    + '<button class="rdvBtn" id="rdvBtn" onclick="rdvBtn();" role="button">Cliquer ici</button> ';
                Gdiv.scroll(0, Gdiv.scrollHeight);
                typeRdv = 'rendez vous';
                candItt = -2;
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