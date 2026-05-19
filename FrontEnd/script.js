const gallery = document.querySelector(".gallery"); // Appel de la div "gallery" afin de la pointer facilement par la suite

// Appel des éléments utiles pour l'après-connexion

const loginText = document.querySelector(".login-text");
const modifyBtn = document.getElementById('modify');
const filterContainer = document.querySelector(".filter-container");
const editionMode = document.querySelector(".edition");

// Appel de tous les inputs nécessaires au filtre :

const filterAll = document.getElementById('all');
const filterObject = document.getElementById('objects');
const filterApartment = document.getElementById('apartments');
const filterHotel = document.getElementById('hotels');

let contentData=[];

// Fonction de Récupération de données :

async function fetchData() {

    const response = await fetch('http://localhost:5678/api/works');

    contentData = await response.json();

    displayData(contentData);
};

// Fonction d'affichage de données :

function displayData(array)  {

    gallery.innerHTML = array.map(project => 

        `
        <figure>
            <img src="${project.imageUrl}" alt="${project.title}">
            <figcaption>${project.title}</figcaption>
        </figure>
        `

    ).join("");

};

// Les différants filtres :

let filteredArray = [];


// Le filtre "Tout"
filterAll.addEventListener("change", ()=>{

    displayData(contentData);

});


// Le filtre "Objet"
filterObject.addEventListener("change", ()=>{

    filteredArray = contentData.filter((element) => element.category.id === 1);

    displayData(filteredArray);

});


// Le filtre "Appartements"
filterApartment.addEventListener("change", ()=>{

    filteredArray = contentData.filter((element) => element.category.id === 2);

    displayData(filteredArray);

});


// Le filtre "Hôtels & Restaurants"
filterHotel.addEventListener("change", ()=>{

    filteredArray = contentData.filter((element) => element.category.id === 3);

    displayData(filteredArray);

});

fetchData();

// Redirection vers la page Login

function RedirectToLogin() {
    document.location.href ="./Login/Login.html";
};

const login = document.querySelector(".login-text");

login.addEventListener("click", ()=>{

    RedirectToLogin();

});

// Fonction permettant de tracker la connexion de l'utilisateur et de changer le contenu de la page principale après une connexion réussie

function loginCheck() {

    if (sessionStorage.tokenKey){ // Cette condition vérifie si le "tokenKey" existe dans le sessionStorage

        loginText.textContent = "logout"; // Je change le texte "login" en "logout"

        modifyBtn.style.display = "block"; // Je fais apparaître le bouton "Modifier"

        filterContainer.style.display = "none"; // Je fais disparaître les filtres

        editionMode.style.display = "flex"; // Je fais apparaître la bande "édition"

        loginText.onclick = () =>{ // Je mets un petit évenement sur le clic du "logout" qui va vider le tokenKey et recharger la page

            sessionStorage.tokenKey = "";

            document.location.reload();

        }

    } else {
        loginText.textContent = "login"; // Si la "tokenKey" n'est pas identifié ou bien vide alors le texte reste "login"
    };

    
};

loginCheck();

