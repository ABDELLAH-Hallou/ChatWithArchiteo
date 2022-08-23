
function showChatCard(param) {
    var chatbotIcon = document.getElementsByClassName('chat-icon');
    var CloseChatIcon = document.getElementsByClassName('chat-icon-close');
    var chatCard = document.getElementsByClassName('chat-card');
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
        xmlhttp.open("POST", "http://127.0.0.1:5000/", true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
                if (xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText);
                    var res = xmlhttp.responseText;
                    var div = document.getElementById("chat");
                    div.innerHTML += '<div class="media media-chat from-chat">' +
                        '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                        '<div class="media-body">' +
                        '<p>' + res + '</p>' +
                        '</div>' +
                        '</div>';
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

function previewFile(input) {
    var div = document.getElementById("chat");

    var reader = new FileReader();
    reader.readAsDataURL(document.getElementById("file-input").files[0]);
    var filename = document.getElementById("file-input").files[0]['name'];
    var extension = filename.split('.').pop();
    var validExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'ai'];
    var Gdiv = document.getElementById("chat-content");
    if (validExtensions.includes(extension.toLowerCase())) {

        reader.onload = function (REvent) {

            div.innerHTML += '<div class="media media-chat media-chat-reverse">' +
                "<embed    scrolling='yes' height=50px width=50px src='" + REvent.target.result + "' alt='You file is uploaded'>";

        };
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

window.onload = function () {
    var input = document.getElementById("message");
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("sendBtn").click();
        }
    });
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
        'num_tel': "Qu'il est votre numéro de téléphone?"
                 };
    candidat = {};
    restart = true;
}