function candidature(questions) {
    stops = ['retour', 'annuler'];
    error = {
        'notContinue': 'Veuillez saisir Continuer pour commencer ou Annuler pour Annuler la candidature',
        'notCorrect': "S'il vous plaît, essaie d'écrire la reponse correctement!"
    };
    message = " Nous sommes ravi d'accueillir des talents comme vous dans notre entreprise .\nJe vais vous poser des questions afin d'enregister votre candidature .\nPour continuer Taper Continuer .\nPour annuler la canidature répondre par Annuler (maintenant ou dans n'importe quelle question ) .\nPour modifier la réponse de la question précédente écrivez Retour .";
    // questions = {
    //     'nom': 'Quel est votre nom complet ?',
    //     'ann_exp': "combien avez vous d'années d'expériences ?",
    //     'employeur': "Qu'il est votre employeur actuel s'il existe ?",
    //     'expertise': "Qu'il est votre domaine d'expertise ?",
    //     'type': "Est-ce que vous visez un poste précis(Oui/Non), si Oui veuillez le mentionner",
    //     'email': "Quel est votre email ?",
    //     'num_tel': "Qu'il est votre numéro de téléphone?",
    //     'adresse': "Quel est votre adresse ?"
    // };
    candArr = []
    for (const key in questions) {
        candArr.push(key);
    }
    return { "questions": questions, "message": message, "error": error, "stops": stops };
}


function filloutC(it) {
    var clientmsg = document.getElementById("message").value;
    if (clientmsg != "") {
        postCandidature(it, clientmsg);
        candItt++;
    }
}
function postCandidature(it, clientmsg){
    if (it + 1 < candArr.length) {
        var key = candArr[it + 1];
        var Candidature = JSON.parse(JSON.stringify(candidatureObj));
        if (it < 0 && clientmsg.toLowerCase() != "continuer") {
            fromUser(clientmsg);
            if (clientmsg.toLowerCase() == "annuler") {

                document.getElementById('sendBtnC').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                fromChat('votre condidature est annulée');
                candItt = -2;
            } else {
                fromChat(Candidature.error['notContinue']);
                candItt--;
            }

        } else {
            if (clientmsg.toLowerCase() != "retour") {
                var question = Candidature.questions[key];
                candidatRes[key] = "";
                if (candidatRes[candArr[it]] === undefined) {
                    fromUser(clientmsg);
                    fromChat(question);
                }
                else {
                    if (clientmsg.toLowerCase() == "annuler") {
                        document.getElementById('sendBtnC').style.display = "none";
                        document.getElementById('sendBtn').style.display = "block";
                        fromUser(clientmsg);
                        fromChat('votre condidature est annulée');
                        candItt = -2;
                    } else {
                        fromUser(clientmsg);
                        candidatRes[candArr[it]] = clientmsg;
                        console.log(candidatRes.email);
                        console.log(candidatRes);
                        if(candidatRes.email !== "" && candidatRes.email !== undefined){
                            var msg = validation_email('cnd', candidatRes.email);
                            console.log(msg);
                            if(msg != true){
                                fromChat(msg);
                                document.getElementById("message").value = "";
                                candItt--;
                                return;
                            }
                        }
                        fromChat(question);
                    }
                }
            } else {
                candidatRes = {};
                candItt = -1;
                var key = candArr[candItt + 1];
                var question = Candidature.questions[key];
                candidatRes[key] = "";
                fromUser(clientmsg);
                fromChat(question);
            }
        }
    }
    else {
        if (it + 1 == candArr.length && clientmsg != "retour") {
            var key = candArr[it];
            // var clientmsg = document.getElementById("message").value;
            var Candidature = JSON.parse(JSON.stringify(candidatureObj));
            if (clientmsg.toLowerCase() == "annuler") {
                document.getElementById('sendBtnC').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                fromUser(clientmsg);
                fromChat('votre condidature est annulée');
                candItt = -2;
            } else {
                fromUser(clientmsg);
                candidatRes[key] = clientmsg;
                fromChat('Envoyez nous votre cv!');
                document.getElementById('addCv').style.display= "block";
                candItt = -2;
                document.getElementById('sendBtnC').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                var dataToString = JSON.stringify(candidatRes);
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", "/post-candidature", false);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                        if (xmlhttp.status == 200) {
                            console.log(xmlhttp.responseText);
                            res = JSON.parse(xmlhttp.responseText);
                            candidatureId = res.id;
                            userId = res.userId;
                        } else if (xmlhttp = 400) {
                            alert('There was an error status =400');
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
                candidatRes = {};
                candItt = -1;
                var key = candArr[candItt + 1];
                var question = Candidature.questions[key];
                candidatRes[key] = "";
                fromUser(clientmsg);
                fromChat(question);
            }
    }
    document.getElementById("message").value = "";
}