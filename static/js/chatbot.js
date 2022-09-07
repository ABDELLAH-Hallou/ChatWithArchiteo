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
    var todayTime = document.getElementsByClassName("chat-day");
    let today = new Date();
    for (const iterator of todayTime) {
        iterator.innerHTML += "Today " + today.getHours() + ":" + today.getMinutes().toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
    }

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
    getResponse(clientmsg);

}
function getResponse(clientmsg) {
    if (clientmsg != "") {
        document.getElementById("message").value = "";
        fromUser(clientmsg);
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
                    res = res.substring(1, res.length - 2);
                    console.log(res);
                    if (res == "candidature") {
                        var Candidature = candidature();
                        fromChat(Candidature.message);
                        document.getElementById('sendBtn').style.display = "none";
                        document.getElementById('sendBtnC').style.display = "block";
                    } else {

                        if (res == "consultation" || res == "recrutement" || res == "délocalisation" || res == "formation" || res == "Startupping") {
                            var Autre = autre(res);
                            clientService = res;
                            fromChat(Autre.message);
                            document.getElementById('sendBtn').style.display = "none";
                            document.getElementById('sendBtnA').style.display = "block";

                        }
                        else {
                            // if ("de quel service vous souhaitez bénéficier? Notre entreprise propose des services comme acueillir des candidatures,donner des formations,répondre à des consultations,réaliser des projets informatiques    " == res) {
                            //     var div = document.getElementById("chat");
                            //     var Gdiv = document.getElementById("chat-content");
                            //     div.innerHTML += '<div class="media media-chat from-chat">' +
                            //         '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                            //         '<div class="media-body">' +
                            //         '<p>' + "Cliquer sur le button pour choisir un créneau qui vous convient" + '</p>' +
                            //         '</div>' + '</div>'
                            //         + '<div class="media media-chat from-chat">' +
                            //         '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                            //         '<div class="media-body">' +
                            //         '<p>' + "les créneaux disponibles sont "+ allowedTime().jour + "à "+ allowedTime().hour + '</p>' +
                            //         '</div>' + '</div>'
                            //         + '<button class="rdvBtn" id="rdvBtn" onclick="rdvBtn();" role="button">Cliquer ici</button> ';
                            //     Gdiv.scroll(0, Gdiv.scrollHeight);
                            // } else {
                            fromChat(res);
                            // }
                        }
                    }
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
}
function fromChat(res) {
    var div = document.getElementById("chat");
    var Gdiv = document.getElementById("chat-content");
    div.innerHTML += '<div class="media media-chat from-chat">' + '<img class="avatar" src="../static/images/chatbot.png" alt="...">' + '<div class="media-body">' + '<p>' + res + '</p>' + '</div>' + '</div>';
    Gdiv.scroll(0, Gdiv.scrollHeight);
}

function fromUser(msg) {
    var div = document.getElementById("chat");
    var Gdiv = document.getElementById("chat-content");
    div.innerHTML += '<div class="media media-chat media-chat-reverse">' + '<div class="media-body">' + '<p>' + msg + '</p>' + '</div>' + '</div>';
    Gdiv.scroll(0, Gdiv.scrollHeight);
}

function validation_email(type, email) {
    personnel = ['gmail', 'hotmail', 'outlook', 'zoho', 'protonmail', 'aol', 'mail', 'gmx', 'icloud', 'yandex', 'aim', 'yahoo'];
    var expressionReguliere = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+))|("[\w-\s]+")([\w-]+(?:\.[\w-]+)))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (expressionReguliere.test(email)) {
        after = email.split("@")[1];
        domaine = after.split('.')[0];
        if (personnel.includes(domaine) && type === "clt")
            return "Veuillez Saisir une adresse émail professionnelle";
        else return true;
    }

    else return "Veuillez Saisir une adresse émail valide";
}