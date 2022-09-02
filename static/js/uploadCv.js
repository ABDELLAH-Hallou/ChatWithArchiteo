function previewFile() {
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
        // console.log(file);

        var fd = new FormData();
        fd.append("file", file);
        fd.append("id", candidatureId);
        // console.log(fd);

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
                // div.innerHTML += '<div class="media media-chat from-chat">' +
                //     '<img class="avatar" src="../static/images/chatbot.png" alt="...">' +
                //     '<div class="media-body">' +
                //     '<p>' + res + '</p>' +
                //     '</div>' +
                //     '</div>';
                // Gdiv.scroll(0, Gdiv.scrollHeight);
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