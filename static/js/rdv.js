function rdvBtn() {
    document.getElementById("datetime").focus();
    document.getElementById("datetime").showPicker();
}

const getRdvs = function () {
    var xhr = new XMLHttpRequest();
    var date = new Array();
    xhr.open("GET", "/get-rdvs", false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                
            } else if (xhr = 400) {
                console.log("There was an error status = 400");
            } else {
                console.log('something else other than 200 was returned');
            }
            if (xhr.readyState == 4) {
                rdvs = JSON.parse(xhr.responseText);
                for (const iterator of rdvs['les_rdv']) {
                    d = new Date(iterator.dateRdv)
                    date.push(d.getTime());
                }
            }
        }
    };
    xhr.send();
    return date;
}

const isValidDate = function (date, daysNbr) {
    if (daysNbr.includes(date.getDay()))
        return true;
    else return false;
}

const isValidTime = function (time, hours) {
    if (hours.includes(time))
        return true;
    else return false;
}

function changeDate() {
    var datetime = document.getElementById("datetime").value;
    var datef = datetime.substr(0, 10);
    var date = new Date(datetime);
    var time = date.getHours() + ":" + date.getMinutes().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    var dates = getRdvs();

    if (dates.includes(date.getTime())) {
        fromUser(datef + " " + time);
        fromChat("Ce créneau est deja réservé");
    } else {
        // time = datetime.substr(11);
        var valid = true;
        var xmlhttp = new XMLHttpRequest();
        var xhr = new XMLHttpRequest();
        var days = "";
        var daysNbr = [];
        var hoursObj = "";
        var hours = [];
        xmlhttp.open("GET", "/get-JourRdvs", true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    days = JSON.parse(xmlhttp.responseText);
                    for (const iterator of days['jours']) {
                        daysNbr.push(iterator.number);
                    }
                    valid = isValidDate(date, daysNbr) && valid;
                    xhr.open("GET", "/get-horaires", true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == XMLHttpRequest.DONE) {
                            if (xhr.status == 200) {
                                hoursObj = JSON.parse(xhr.responseText);
                                for (const iterator of hoursObj['horaires']) {
                                    hours.push(iterator.heure);
                                }
                                valid = isValidTime(time, hours) && valid;
                                fromUser(datef + " " + time);
                                if (valid) {
                                    postRdv(datef + " " + time);
                                }
                                else {
                                    fromChat("Veuillez choisir un autre créneau!");
                                }
                            } else if (xhr = 400) {
                                console.log('There was an error status =400');
                            } else {
                                console.log('something else other than 200 was returned');
                            }
                        }
                    };
                    xhr.send();
                } else if (xmlhttp = 400) {
                    console.log('There was an error status =400');
                } else {
                    console.log('something else other than 200 was returned');
                }
            }
        };
        xmlhttp.send();
    }
}
function postRdv(date) {
    var req = {
        'id_utilisateur': userId,
        'dateRdv': date,
        'typeRdv': 'rendez vous'
    };

    var dataToString = JSON.stringify(req);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "/post-rdv", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                fromChat('Votre rendez-vous est confirmé');
            } else if (xhr = 400) {
                console.log('There was an error status =400');
            } else {
                console.log('something else other than 200 was returned');
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(dataToString);
}