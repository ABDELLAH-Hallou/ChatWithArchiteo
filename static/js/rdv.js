function rdvBtn() {
    document.getElementById("datetime").focus();
    document.getElementById("datetime").showPicker();
}
const isValidDate = function (date, daysNbr) {
    console.log(date.getDay());
    if (daysNbr.includes(date.getDay()))
        return true;
    else return false;
}

const isValidTime = function (time, hours) {
    console.log(hours.includes(time), hours, time);
    if (hours.includes(time))
        return true;
    else return false;
}

function changeDate() {
    var datetime = document.getElementById("datetime").value;
    datef = datetime.substr(0, 10);
    console.log("date", datef);
    date = new Date(datetime);
    console.log("to date", date);
    time = datetime.substr(11);
    console.log("time", time);

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
                console.log(xmlhttp.responseText);
                days = JSON.parse(xmlhttp.responseText);
                for (const iterator of days['jours']) {
                    daysNbr.push(iterator.number);
                }
                valid = isValidDate(date, daysNbr) && valid;
                xhr.open("GET", "/get-horaires", true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        if (xhr.status == 200) {
                            console.log(xhr.responseText);
                            hoursObj = JSON.parse(xhr.responseText);
                            for (const iterator of hoursObj['horaires']) {
                                hours.push(iterator.heure);
                            }
                            valid = isValidTime(time, hours) && valid;
                            fromUser(datef + " " + time);
                            if (valid) {
                                postRdv(datef + " " + time);
                            }
                            else{
                                fromChat("Choisi un autre créneaux s'il vous plaît!");
                            }
                        } else if (xhr = 400) {
                            alert('There was an error status =400');
                        } else {
                            alert('something else other than 200 was returned');
                        }
                    }
                };
                xhr.send();
            } else if (xmlhttp = 400) {
                alert('There was an error status =400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.send();
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
                fromChat('votre rendez vous est confirmé');
            } else if (xhr = 400) {
                alert('There was an error status =400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(dataToString);
}