window.onload = function () {
    var input = document.getElementById("message");
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (document.getElementById("sendBtn").style.display == 'none' && document.getElementById("sendBtnA").style.display == 'none')
                document.getElementById("sendBtnC").click();
            else
                if (document.getElementById("sendBtnC").style.display == 'none' && document.getElementById("sendBtnA").style.display == 'none')
                    document.getElementById("sendBtn").click();
                else
                    document.getElementById("sendBtnA").click();
        }
    });
    showMsg();

}
const showMsg = async () => {
    await delay(5000);
    var elemnt = document.getElementsByClassName('message-popup');
    var chatbotIcon = document.getElementsByClassName('chat-icon');
    for (const ite of chatbotIcon) {
        if (ite.style.display != 'none') {
            for (const iterator of elemnt) {
                iterator.style.display = 'block';
            }
            await delay(10000);
            for (const iterator of elemnt) {
                iterator.style.display = 'none';
            }
        }
    }

};
const delay = ms => new Promise(res => setTimeout(res, ms));
function showChatCard(param) {
    var chatbotIcon = document.getElementsByClassName('chat-icon');
    var CloseChatIcon = document.getElementsByClassName('chat-icon-close');
    var chatCard = document.getElementsByClassName('chat-card');
    var hello = document.getElementsByClassName('message-popup');
    if (param == 'open') {
        for (const iterator of chatCard) {
            iterator.style.display = 'flex';
        }
        for (const iterator of chatbotIcon) {
            iterator.style.display = 'none';
        }
        for (const iterator of CloseChatIcon) {
            iterator.style.display = 'block';
        }
        for (const iterator of hello) {
            iterator.style.display = 'none';
        }
        document.getElementById("message").focus();
    } else {
        for (const iterator of chatCard) {
            iterator.style.display = 'none';
        }

        for (const iterator of CloseChatIcon) {
            iterator.style.display = 'none';
        }
        for (const iterator of chatbotIcon) {
            iterator.style.display = 'block';
        }
    }

}

function send() {
    var clientmsg = document.getElementById("message").value;

    var Candidature = candidature();


    if (clientmsg != "") {
        document.getElementById("message").value = "";
        var control = '<div class="media media-chat media-chat-reverse">' +
            '<div class="media-body">' +
            '<p>' + clientmsg + '</p>' +
            '</div>' +
            '</div>';
        var div = document.getElementById("chat");
        var Gdiv = document.getElementById("chat-content");
        div.innerHTML += control;
        Gdiv.scroll(0, Gdiv.scrollHeight);

        let value = clientmsg;
        var data = { "pattern": value };
        var dataToString = JSON.stringify(data);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/chat", true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
                if (xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText);
                    var res = xmlhttp.responseText;
                    var div = document.getElementById("chat");
                    res = res.substring(1, res.length - 2);
                    if (res == "candidature") {
                        div.innerHTML += '<div class="media media-chat from-chat">' +
                            '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                            '<div class="media-body">' +
                            '<p>' + Candidature.message + '</p>' +
                            '</div>' +
                            '</div>';
                        document.getElementById('sendBtn').style.display = "none";
                        document.getElementById('sendBtnC').style.display = "block";
                    } else {

                        if (res == "consultation" || res == "recrutement" || res == "délocalisation" || res == "formation" || res == "Startupping") {
                            var Autre = autre(res);
                            clientService = res;
                            div.innerHTML += '<div class="media media-chat from-chat">' +
                                '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                                '<div class="media-body">' +
                                '<p>' + Autre.message + '</p>' +
                                '</div>' +
                                '</div>';
                            document.getElementById('sendBtn').style.display = "none";
                            document.getElementById('sendBtnA').style.display = "block";

                        }
                        else {
                            if (["avec plaisir quel est le meilleur moment pour vous?", "avec plaisir quel est le moment qui vous convient?"].includes(res.toLowerCase())) {
                                div.innerHTML += '<div class="media media-chat from-chat">' +
                                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                                    '<div class="media-body">' +
                                    '<p>' + "Cliquer sur le button pour choisir un créneau qui vous convient" + '</p>' +
                                    '</div>' +
                                    '</div>' + '<button class="rdvBtn" id="rdvBtn" onclick="rdvBtn();" role="button">Cliquer ici</button> ';
                            } else {
                                div.innerHTML += '<div class="media media-chat from-chat">' +
                                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                                    '<div class="media-body">' +
                                    '<p>' + res + '</p>' +
                                    '</div>' +
                                    '</div>';
                            }

                        }
                    }


                    Gdiv.scroll(0, Gdiv.scrollHeight);
                } else if (xmlhttp = 400) {
                    alert('There was an error 4.status =00');
                } else {
                    alert('something else other than 200 was returned');
                }
            }
        };
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(dataToString);


        Gdiv.scroll(0, Gdiv.scrollHeight);
    }

}

function rdvBtn() {
    document.getElementById("datetime").focus();
    document.getElementById("datetime").showPicker();
}
function changeDate(){
    var time = document.getElementById("datetime").value;
    
}


function previewFile(input) {
    var div = document.getElementById("chat");
    // cvForm
    var reader = new FileReader();
    reader.readAsDataURL(document.getElementById("file-input").files[0]);
    var filename = document.getElementById("file-input").files[0]['name'];
    console.log(document.getElementById("file-input").value);
    var extension = filename.split('.').pop();
    var validExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'ai'];
    var Gdiv = document.getElementById("chat-content");
    if (validExtensions.includes(extension.toLowerCase())) {

        reader.onload = function (REvent) {
            div.innerHTML += '<div class="media media-chat media-chat-reverse">' +
                "<embed    scrolling='yes' height=50px width=50px src='" + REvent.target.result + "' alt='You file is uploaded'>";

        };
        var fileInput = document.getElementById('file-input');
        console.log(fileInput);
        var file = fileInput.files[0];
        console.log(file);

        var fd = new FormData();
        fd.append("file", file);
        fd.append("id", candidatureId);
        console.log(fd);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/cv', true);
        // xhr.upload.onprogress = function (e) {
        //     if (e.lengthComputable) {
        //         var percentComplete = (e.loaded / e.total) * 100;
        //         console.log(percentComplete + '% uploaded');
        //     }
        // };

        xhr.onreadystatechange = function () {
            if (xhr.status == 200) {
                console.log(xhr.responseText);
                var res = xhr.responseText;
                res = res.substring(1, res.length - 2);
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + res + '</p>' +
                    '</div>' +
                    '</div>';
                    Gdiv.scroll(0, Gdiv.scrollHeight);
            } else if (xhr = 400) {
                alert('There was an error 4.status =00');
            } else {
                alert('something else other than 200 was returned');
            }
        };

        xhr.send(fd);

    } else {
        div.innerHTML += '<div class="media media-chat from-chat">' +
            '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
            '<div class="media-body">' +
            '<p>' + 'Format de fichier non valide' + '</p>' +
            '</div>' +
            '</div>';

    }
    Gdiv.scroll(0, Gdiv.scrollHeight);
}


// functions candidate and autre
function candidature() {
    stops = ['retour', 'annuler'];
    error = {
        'notContinue': 'Veuillez saisir Continuer pour commencer ou Annuler pour Annuler la candidature',
        'notCorrect': "S'il vous plaît, essaie d'écrire la reponse correctement!"
    };
    message = " Nous sommes ravi d'accueillir des talents comme vous dans notre entreprise .\nJe vais vous poser des questions afin d'enregister votre candidature .\nPour continuer Taper Continuer .\nPour annuler la canidature répondre par Annuler (maintenant ou dans n'importe quelle question ) .\nPour modifier la réponse de la question précédente écrivez Retour .";
    questions = {
        'nom': 'Quel est votre nom complet ?',
        'ann_exp': "combien avez vous d'années d'expériences ?",
        'employeur': "Qu'il est votre employeur actuel s'il existe ?",
        'expertise': "Qu'il est votre domaine d'expertise ?",
        'type': "Est-ce que vous visez un poste précis(Oui/Non), si Oui veuillez le mentionner",
        'email': "Quel est votre email ?",
        'num_tel': "Qu'il est votre numéro de téléphone?",
        'adresse': "Quel est votre adresse ?"
    };
    return { "questions": questions, "message": message, "error": error, "stops": stops };
}


function filloutC(it) {
    if (it + 1 < candArr.length) {
        var key = candArr[it + 1];

        var clientmsg = document.getElementById("message").value;
        var Candidature = candidature();
        var div = document.getElementById("chat");
        var Gdiv = document.getElementById("chat-content");
        if (it < 0 && clientmsg.toLowerCase() != "continuer") {
            var control = '<div class="media media-chat media-chat-reverse">' +
                '<div class="media-body">' +
                '<p>' + clientmsg + '</p>' +
                '</div>' +
                '</div>';
            div.innerHTML += control;
            if (clientmsg.toLowerCase() == "annuler") {

                document.getElementById('sendBtnC').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + 'votre condidature est annulée' + '</p>' +
                    '</div>' +
                    '</div>';
                candItt = -2;
            } else {
                console.log(Candidature.error['notContinue']);
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + Candidature.error['notContinue'] + '</p>' +
                    '</div>' +
                    '</div>';
                candItt--;
            }
            Gdiv.scroll(0, Gdiv.scrollHeight);

        } else {
            if (clientmsg.toLowerCase() != "retour") {
                var question = Candidature.questions[key];
                candidatRes[key] = "";
                // if(candidatRes.hasOwnProperty(candArr[candItt])){
                if (candidatRes[candArr[it]] === undefined) {
                    var control = '<div class="media media-chat media-chat-reverse">' +
                        '<div class="media-body">' +
                        '<p>' + clientmsg + '</p>' +
                        '</div>' +
                        '</div>';
                    div.innerHTML += control;
                    div.innerHTML += '<div class="media media-chat from-chat">' +
                        '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                        '<div class="media-body">' +
                        '<p>' + question + '</p>' +
                        '</div>' +
                        '</div>';
                    Gdiv.scroll(0, Gdiv.scrollHeight);
                }
                else {
                    if (clientmsg.toLowerCase() == "annuler") {
                        document.getElementById('sendBtnC').style.display = "none";
                        document.getElementById('sendBtn').style.display = "block";
                        var control = '<div class="media media-chat media-chat-reverse">' +
                            '<div class="media-body">' +
                            '<p>' + clientmsg + '</p>' +
                            '</div>' +
                            '</div>';
                        div.innerHTML += control;
                        div.innerHTML += '<div class="media media-chat from-chat">' +
                            '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                            '<div class="media-body">' +
                            '<p>' + 'votre condidature est annulée' + '</p>' +
                            '</div>' +
                            '</div>';
                        candItt = -2;
                    } else {
                        var control = '<div class="media media-chat media-chat-reverse">' +
                            '<div class="media-body">' +
                            '<p>' + clientmsg + '</p>' +
                            '</div>' +
                            '</div>';
                        div.innerHTML += control;
                        candidatRes[candArr[it]] = clientmsg;
                        console.log(candidatRes);
                        div.innerHTML += '<div class="media media-chat from-chat">' +
                            '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                            '<div class="media-body">' +
                            '<p>' + question + '</p>' +
                            '</div>' +
                            '</div>';
                    }

                    Gdiv.scroll(0, Gdiv.scrollHeight);
                }




            } else {
                candidatRes = {};
                candItt = -1;
                var key = candArr[candItt + 1];
                var question = Candidature.questions[key];
                candidatRes[key] = "";
                var control = '<div class="media media-chat media-chat-reverse">' +
                    '<div class="media-body">' +
                    '<p>' + clientmsg + '</p>' +
                    '</div>' +
                    '</div>';
                div.innerHTML += control;
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + question + '</p>' +
                    '</div>' +
                    '</div>';
                Gdiv.scroll(0, Gdiv.scrollHeight);
            }
        }
    }
    else {
        if (it + 1 == candArr.length && clientmsg != "retour") {
            var key = candArr[it];
            var clientmsg = document.getElementById("message").value;
            var Candidature = candidature();
            var div = document.getElementById("chat");
            var Gdiv = document.getElementById("chat-content");
            if (clientmsg.toLowerCase() == "annuler") {
                document.getElementById('sendBtnC').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                var control = '<div class="media media-chat media-chat-reverse">' +
                    '<div class="media-body">' +
                    '<p>' + clientmsg + '</p>' +
                    '</div>' +
                    '</div>';
                div.innerHTML += control;
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + 'votre condidature est annulée' + '</p>' +
                    '</div>' +
                    '</div>';
                candItt = -2;
                Gdiv.scroll(0, Gdiv.scrollHeight);
            } else {
                var control = '<div class="media media-chat media-chat-reverse">' +
                    '<div class="media-body">' +
                    '<p>' + clientmsg + '</p>' +
                    '</div>' +
                    '</div>';
                div.innerHTML += control;
                candidatRes[key] = clientmsg;
                console.log(candidatRes);
                // div.innerHTML += '<div class="media media-chat from-chat">' +
                //     '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                //     '<div class="media-body">' +
                //     '<p>' + 'votre condidature est enregistré!' + '</p>' +
                //     '</div>' +
                //     '</div>';
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + 'Envoyez nous votre cv!' + '</p>' +
                    '</div>' +
                    '</div>';
                Gdiv.scroll(0, Gdiv.scrollHeight);
                candItt = -1;
                document.getElementById('sendBtnC').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                var dataToString = JSON.stringify(candidatRes);
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", "/post-candidature", true);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                        if (xmlhttp.status == 200) {
                            console.log(xmlhttp.responseText);
                            res = JSON.parse(xmlhttp.responseText);
                            candidatureId = res.id;
                        } else if (xmlhttp = 400) {
                            alert('There was an error 4.status =00');
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
                var control = '<div class="media media-chat media-chat-reverse">' +
                    '<div class="media-body">' +
                    '<p>' + clientmsg + '</p>' +
                    '</div>' +
                    '</div>';
                div.innerHTML += control;
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + question + '</p>' +
                    '</div>' +
                    '</div>';
                Gdiv.scroll(0, Gdiv.scrollHeight);
            }
    }
    document.getElementById("message").value = "";
}


// functions  autre
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
        if (!clientArr.includes('type_part')) {
            clientArr.push('type_part');
        }

    }
    if (["consultation", "formation"].includes(service.toLowerCase())) {
        questions["domain"] = "Quel est le domain dont vous souhaitez faire la " + service.toLowerCase() + "?";
        if (!clientArr.includes('domain')) {
            clientArr.push('domain');
        }
    }
    if (service.toLowerCase() == "recrutement") {
        delete questions.nbr_pers;
        if (clientArr.includes('nbr_pers')) {
            clientArr.splice(clientArr.indexOf("nbr_pers"), 1);
        }
        questions["nbr_recrut"] = "Quel est le nombre de personnes à recruter ?";
        questions["commentaires"] = "Ajoutez des commentaires si vous souhaitez";
        if (!clientArr.includes('nbr_recrut') && !clientArr.includes('commentaires')) {
            clientArr.push('nbr_recrut');
            clientArr.push('commentaires');
        }
    }
    return { "questions": questions, "message": message, "error": error, "stops": stops };
}


// function autre
function filloutA(it) {
    console.log("arr", clientArr);
    if (it + 1 < clientArr.length) {
        var key = clientArr[it + 1];
        console.log("key: ", key);
        var clientmsg = document.getElementById("message").value;
        var Autre = autre(clientService);
        var div = document.getElementById("chat");
        var Gdiv = document.getElementById("chat-content");
        if (it < 0 && clientmsg.toLowerCase() != "continuer") {
            var control = '<div class="media media-chat media-chat-reverse">' +
                '<div class="media-body">' +
                '<p>' + clientmsg + '</p>' +
                '</div>' +
                '</div>';
            div.innerHTML += control;
            if (clientmsg.toLowerCase() == "annuler") {

                document.getElementById('sendBtnA').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + 'votre demande est annulée' + '</p>' +
                    '</div>' +
                    '</div>';
                candItt = -2;
            } else {
                console.log(Autre.error['notContinue']);
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + Autre.error['notContinue'] + '</p>' +
                    '</div>' +
                    '</div>';
                candItt--;
            }
            Gdiv.scroll(0, Gdiv.scrollHeight);

        } else {
            if (clientmsg.toLowerCase() != "retour") {
                var question = Autre.questions[key];
                clientRes[key] = "";
                if (clientRes[clientArr[it]] === undefined) {
                    var control = '<div class="media media-chat media-chat-reverse">' +
                        '<div class="media-body">' +
                        '<p>' + clientmsg + '</p>' +
                        '</div>' +
                        '</div>';
                    div.innerHTML += control;
                    div.innerHTML += '<div class="media media-chat from-chat">' +
                        '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                        '<div class="media-body">' +
                        '<p>' + question + '</p>' +
                        '</div>' +
                        '</div>';
                    Gdiv.scroll(0, Gdiv.scrollHeight);
                }
                else {
                    if (clientmsg.toLowerCase() == "annuler") {
                        document.getElementById('sendBtnA').style.display = "none";
                        document.getElementById('sendBtn').style.display = "block";
                        var control = '<div class="media media-chat media-chat-reverse">' +
                            '<div class="media-body">' +
                            '<p>' + clientmsg + '</p>' +
                            '</div>' +
                            '</div>';
                        div.innerHTML += control;
                        div.innerHTML += '<div class="media media-chat from-chat">' +
                            '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                            '<div class="media-body">' +
                            '<p>' + 'votre demande est annulée' + '</p>' +
                            '</div>' +
                            '</div>';
                        candItt = -2;
                    }
                    else {
                        var control = '<div class="media media-chat media-chat-reverse">' +
                            '<div class="media-body">' +
                            '<p>' + clientmsg + '</p>' +
                            '</div>' +
                            '</div>';
                        div.innerHTML += control;
                        clientRes[clientArr[it]] = clientmsg;
                        console.log(clientRes);

                        if (["personne physique", "pp"].includes(clientRes['type'].toLowerCase())) {
                            Autre.questions['nom'] = "Quel est votre nom complet ?";
                            question = Autre.questions[key];
                            div.innerHTML += '<div class="media media-chat from-chat">' +
                                '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                                '<div class="media-body">' +
                                '<p>' + question + '</p>' +
                                '</div>' +
                                '</div>';
                        }
                        if (["société", "societe"].includes(clientRes['type'].toLowerCase())) {
                            Autre.questions['nom'] = "Qelle est votre Raison Social ?";
                            Autre.questions["nbr_pers"] = "Combien d'employés travaillent dans votre société  ?";
                            question = Autre.questions[key];
                            div.innerHTML += '<div class="media media-chat from-chat">' +
                                '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                                '<div class="media-body">' +
                                '<p>' + question + '</p>' +
                                '</div>' +
                                '</div>';
                        }
                        if (!["société", "societe"].includes(clientRes['type'].toLowerCase()) && !["personne physique", "pp"].includes(clientRes['type'].toLowerCase())) {
                            Autre.questions['nom'] = "Qelle est votre Raison Social ?";
                            Autre.questions["nbr_pers"] = "Combien d'employés travaillent dans votre société  ?";
                            candItt--;
                            div.innerHTML += '<div class="media media-chat from-chat">' +
                                '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                                '<div class="media-body">' +
                                '<p>' + Autre.questions['type'] + '</p>' +
                                '</div>' +
                                '</div>';
                        }

                    }

                    Gdiv.scroll(0, Gdiv.scrollHeight);
                }




            } else {
                clientRes = {};
                candItt = -1;
                var key = clientArr[candItt + 1];
                var question = Autre.questions[key];
                clientRes[key] = "";
                var control = '<div class="media media-chat media-chat-reverse">' +
                    '<div class="media-body">' +
                    '<p>' + clientmsg + '</p>' +
                    '</div>' +
                    '</div>';
                div.innerHTML += control;
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + question + '</p>' +
                    '</div>' +
                    '</div>';
                Gdiv.scroll(0, Gdiv.scrollHeight);
            }
        }
    }
    else {
        if (it + 1 == clientArr.length && clientmsg != "retour") {
            var key = clientArr[it];
            var clientmsg = document.getElementById("message").value;
            var Autre = autre(clientService);
            var div = document.getElementById("chat");
            var Gdiv = document.getElementById("chat-content");
            if (clientmsg.toLowerCase() == "annuler") {
                document.getElementById('sendBtnA').style.display = "none";
                document.getElementById('sendBtn').style.display = "block";
                var control = '<div class="media media-chat media-chat-reverse">' +
                    '<div class="media-body">' +
                    '<p>' + clientmsg + '</p>' +
                    '</div>' +
                    '</div>';
                div.innerHTML += control;
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + 'votre demande est annulée' + '</p>' +
                    '</div>' +
                    '</div>';
                candItt = -2;
                Gdiv.scroll(0, Gdiv.scrollHeight);
            }
            else {

                var control = '<div class="media media-chat media-chat-reverse">' +
                    '<div class="media-body">' +
                    '<p>' + clientmsg + '</p>' +
                    '</div>' +
                    '</div>';
                div.innerHTML += control;
                clientRes[key] = clientmsg;
                console.log(clientRes);
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + 'merci!' + '</p>' +
                    '</div>' +
                    '</div>';
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
                        } else if (xmlhttp = 400) {
                            alert('There was an error 4.status =00');
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
                var control = '<div class="media media-chat media-chat-reverse">' +
                    '<div class="media-body">' +
                    '<p>' + clientmsg + '</p>' +
                    '</div>' +
                    '</div>';
                div.innerHTML += control;
                div.innerHTML += '<div class="media media-chat from-chat">' +
                    '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                    '<div class="media-body">' +
                    '<p>' + question + '</p>' +
                    '</div>' +
                    '</div>';
                Gdiv.scroll(0, Gdiv.scrollHeight);
            }
    }
    document.getElementById("message").value = "";
}





