let LoggedIn = false;
function tmimata(tmima){
    const main_menu = document.getElementById("main_menu");
    side_menu.innerHTML = "";
    side_menu.style.display = "none";
    
    if(tmima === "bio"){
        side_menu.style.display = "block";
        side_menu.innerHTML = `<h3><b><li onclick = "sidebar_hide()">Βιογραφία</li></b></h3> <hr> <ul><li onclick = "sidebar_bio('bio')">Σύντομη Βιογραφία</li> <li onclick = "sidebar_bio('early_life')">Πρώτα Χρόνια</li></ul>`;
    }
    if(tmima === "foto"){
        side_menu.style.display = "block";
        side_menu.innerHTML = `<h3><b><li onclick = "sidebar_hide()">Φωτογραφίες</li></b></h3> <hr> <ul> <li onclick = "sidebar_pics('race_pics')">Αγώνες</li><li onclick = "sidebar_pics('instagram_pics')">Instagram</li></ul>`;
    }
    if(tmima === "epitevgmata"){
        side_menu.style.display = "block";
        side_menu.innerHTML = `<h3><b><li onclick = "sidebar_hide()">Διακρίσεις</li></b></h3> <hr> <ul><li onclick = "sidebar_epitevgmata('Ολυμπιακοί')">Ολυμπιακοί Αγώνες</li><li onclick = "sidebar_epitevgmata('Πρωτάθλημα')">Παγκόσμιο Πρωτάθλημα Στίβου</li></ul>`;
    }
    if(tmima === "links"){
        side_menu.style.display = "block";
        side_menu.innerHTML = `<h3><b><li onclick = "sidebar_hide()">Βίντεο</li></b></h3> <hr> <ul><li onclick = "sidebar_links('videos')">Αγώνες</li><li onclick = "sidebar_links('interviews')">Συνεντεύξεις</li></ul>`;
    }
    if(tmima === "diaxeirisi"){
        side_menu.innerHTML = `<h3><b><li onclick = "sidebar_hide()">Διαχείριση</li></b></h3> <hr> <ul><li onclick = "sidebar_login()">Σύνδεση</li> <li onclick = "sidebar_logout()">Αποσύνδεση</li></ul>`;
        side_menu.style.display = "block";
    }
    if(tmima === "reset"){
        side_menu.innerHTML = "";
        main_menu.innerHTML = `<h1><b>«Πρέπει να θέσεις στόχους για να μπορέσεις να πιέσεις τον εαυτό σου περισσότερο. Η επιθυμία είναι το κλειδί της επιτυχίας»</b></h1>`;
    }
}
function login(){
    var usernameIN = document.getElementById("u");
    var passwordIN = document.getElementById("p");
    var username = usernameIN.value;
    var password = passwordIN.value;
    fetch("/api/login", {method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username: username, password: password})
    })
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        if(data.success){
            LoggedIn= true;
            alert("Επιτυχής σύνδεση");
            main_menu.innerHTML = `<h1><b>«Πρέπει να θέσεις στόχους για να μπορέσεις να πιέσεις τον εαυτό σου περισσότερο. Η επιθυμία είναι το κλειδί της επιτυχίας»</b></h1>`;
        }
        else{
            alert("Ανεπιτυχής σύνδεση");
        }
    });  
}
function logout(){
    if(!LoggedIn){
        alert("ΣΦΑΛΜΑ. Δέν είστε συνδεδεμένοι")
    }
    else{
        fetch("/api/logout", {method: "POST"})
            .then(function (response){
                return response.json();
            })
            .then(function (data){
                if(data.success){
                    LoggedIn = false;
                    alert("Αποσύνδεση Επιτυχής");
                    main_menu.innerHTML = `<h1><b>«Πρέπει να θέσεις στόχους για να μπορέσεις να πιέσεις τον εαυτό σου περισσότερο. Η επιθυμία είναι το κλειδί της επιτυχίας»</b></h1>`;
                }
            })
    }
}

function sidebar_login(){
    main_menu.innerHTML = `<h3><b>Σύνδεση Διαχειριστή</b></h3> <input id = "u" placeholder"Όνομα χρήστη"> <input id = "p" type = "password" placeholder "Κωδικός Πρόσβασης"> <button onclick = "login()">Σύνδεση</button>`;
}
function sidebar_logout(){
    main_menu.innerHTML = `<h3><b>Αποσύνδεση</b></h3> <p> Θα θέλατε να αποσυνδεθείτε?</p> <button onclick = "logout()">Αποσύνδεση</button>`;
}

function sidebar_epitevgmata(cat){
    fetch("/api/athlete_data/diakriseis")
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            if(cat === "Ολυμπιακοί"){
                title = "Ολυμπιακοί Αγώνες";
            }
            else{
                title = "Παγκόσμιο Προτάθλημα Στίβου";
            }

            let html = `<h2>${title}</h2>` 
            if(LoggedIn){
                html = html + `<textarea id = "editor" style = "width:100%; height:300px;">`;
                data.forEach(function (a){
                    if((cat === "Ολυμπιακοί" && a.text.includes("Ολυμπιακοί")) || (cat === "Πρωτάθλημα" && a.text.includes("Πρωτάθλημα"))){
                        html = html + a.text + "\n\n";
                    }
                });
                html = html + `</textarea> <button onclick = "save_button('${cat}')"> Αποθήκευση </button>`;
            }
            else{
                html = html + "<ul>";
                data.forEach(function (a){
                    if((cat === "Ολυμπιακοί" && a.text.includes("Ολυμπιακοί")) || (cat === "Πρωτάθλημα" && a.text.includes("Πρωτάθλημα"))){
                        html = html + `<li>${a.text}</li>`;
                    }
                    });
                html = html + "</ul>";
            }
            main_menu.innerHTML = html;
        })  
}

function sidebar_links(cat){
    fetch(`/api/links/${cat}`)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            let title;
            if(cat === "videos"){
                title = "Αγώνες";
            }
            else{
                title = "Συνεντεύξεις";
            }
            let html = `<h2>${title}</h2>`

            if(LoggedIn){
                html = html + `<textarea id = "editor" style = "width:100%; height:300px;">`;
                data.forEach(function (a){
                    html = html + a.text + "|" + a.link + "\n";
                });
                html = html + `</textarea> <button onclick = "save_button('${cat}')"> Αποθήκευση </button>`;
            }
            else{
                html = html + "<ul>";
                data.forEach(function (a){
                    html = html + `<li><a href = "${a.link}" target = "_blank"> ${a.text}</a></li>`;
                });
            }
            main_menu.innerHTML = html;
        });
}

function sidebar_pics(cat){
    const pics ={
        instagram_pics: [
            "pic1.jpg",
            "pic2.jpg",
            "pic3.jpg",
            "pic4.jpg",
            "pic5.jpg"    
        ],
        race_pics:[
            "race1.jpg",
            "race2.avif",
            "race3.jpg",
            "race4.webp",
            "race5.jpg"      
        ]
    };
    let html = `<div class = "pics">`;
    pics[cat].forEach(function (a) {
        return html = html + `<img src = "${cat}/${a}" alt = "">`;
    });
    html = html + `</div>`;
    main_menu.innerHTML = html;
}
function sidebar_bio(cat){
    fetch(`/api/athlete_data/${cat}`)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        if(cat === "bio"){
            title = "Σύντομη Βιογραφία";
        }
        else{
            title = "Πρώτα Χρόνια";
        }
        let html = `<h2>${title}</h2>` 
        if(LoggedIn){
            html = html + `<textarea id = "editor" style = "width:100%; height:300px;">`;
            html = html + data.map(function (a){
                return a.text}).join("\n\n");
            html = html + `</textarea> <button onclick = "save_button('${cat}')"> Αποθήκευση </button>`;
        }
        else{
            html = html + "<ul>"
            data.forEach(function (a){
                html = html + `<li>${a.text}</li>`;
            });
            html = html + "</ul>";
        }
        main_menu.innerHTML = html;
    });
}

function sidebar_hide(){
    side_menu.style.display = "none";
}
function save_button(cat){
    const text = document.getElementById("editor").value.trim();
    let url;
    let payload;

    if(cat === "videos" || cat === "interviews"){
        url = `/api/links/${cat}`;
        payload = text.split("\n").filter(function (line){
                return line.includes("|")
            }).map(line => {
                const [text, link] = line.split("|");
                return {text: text.trim(), link: link.trim()};
            });
    }
    else{
        url = `/api/athlete_data/${cat}`;
        payload = text.split("\n\n").map(function (t){
            return {text: t.trim()};
        });
    }
    fetch(url, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)})
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        if(data.success){
            alert("Αποθήκευση έγινε με επιτυχία")
        }
        else{
            alert("ΣΦΑΛΜΑ. Η αποθήκευση απέτυχε")
        }
    });
}
document.getElementById("main_menu").innerHTML = `<h1><b>«Πρέπει να θέσεις στόχους για να μπορέσεις να πιέσεις τον εαυτό σου περισσότερο. Η επιθυμία είναι το κλειδί της επιτυχίας»</b></h1>`;
