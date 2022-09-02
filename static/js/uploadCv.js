function previewFile() {
    var reader = new FileReader();
    reader.readAsDataURL(document.getElementById("file-input").files[0]);
    var filename = document.getElementById("file-input").files[0]['name'];
    console.log(document.getElementById("file-input").value);
    var extension = filename.split('.').pop();
    var validExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'ai'];
    if (validExtensions.includes(extension.toLowerCase())) {

        reader.onload = function (REvent) {
            var title = (filename.split('\\').pop().length <=15) ? filename.split('\\').pop() : filename.split('\\').pop().slice(0, 13)+"...";
            cvDiv(title);
        };
        var fileInput = document.getElementById('file-input');
        console.log(fileInput);
        var file = fileInput.files[0];

        var fd = new FormData();
        fd.append("file", file);
        fd.append("id", candidatureId);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/cv', true);
        xhr.onreadystatechange = function () {
            if (xhr.status == 200) {

                console.log(xhr.responseText);

            } else if (xhr = 400) {
                alert('There was an error 4.status =00');
            } else {
                alert('something else other than 200 was returned');
            }
            if (xhr.readyState == 4) {
                var res = xhr.responseText;
                res = res.substring(1, res.length - 2);
                fromChat(res);
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
            }
        };

        xhr.send(fd);

    } else {
        fromChat('Format de fichier non valide');

    }
}

function cvDiv(res){
    var div = document.getElementById("chat");
    var Gdiv = document.getElementById("chat-content");
    div.innerHTML += '<div class="media media-chat media-chat-reverse">'+
    '<div class="media-body">'+'<div class="cvContainer">'+
        '<svg class="cv" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" /></svg>'+
      '<span>'+res+'</span></div></div></div>';
      Gdiv.scroll(0, Gdiv.scrollHeight);
}