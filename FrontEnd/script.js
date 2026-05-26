const gallery = document.querySelector(".gallery"); // Appel de la div "gallery" afin de la pointer facilement par la suite

// Appel des éléments utiles pour l'après-connexion

const loginText = document.querySelector(".login-text");
const modifyBtn = document.getElementById('modify');
const filterContainer = document.querySelector(".filter-container");
const editionMode = document.querySelector(".edition");

// Appel de touts les inputs nécessaires aux filtres :

const filterAll = document.getElementById('all');
const filterObject = document.getElementById('objects');
const filterApartment = document.getElementById('apartments');
const filterHotel = document.getElementById('hotels');

const modal = document.querySelector(".modal");
const modalWrapper = document.querySelector(".modal-wrapper");
const closeWindow = document.querySelector(".close-window");
const gridContainer = document.querySelector(".grid-container");



let contentData=[];

// Fonction de Récupération de données : ---------------------------------------

async function fetchData() { // Récupération pour la page principale

    const response = await fetch('http://localhost:5678/api/works');

    contentData = await response.json();

    displayData(contentData);
};

let modalData = [];

async function dataModal() { // Récupération pour la fenêtre modale, même fonctionnement que la fonction précedente

    const response = await fetch('http://localhost:5678/api/works');

    modalData = await response.json();

    displayModal(modalData);

    console.log(modalData);

};

dataModal();

// Fonction d'affichage de données : ---------------------------------------------------

function displayData(array)  { // Affichage pour la page principale

    gallery.innerHTML = array.map(project => 

        `
        <figure>
            <img src="${project.imageUrl}" alt="${project.title}">
            <figcaption>${project.title}</figcaption>
        </figure>
        `

    ).join("");

};

function displayModal(array) { // Affichage pour la modale, même fonctionnement que la fonction précedente mais le contenu du map est différant

    gridContainer.innerHTML = array.map(element => 
        `
        
        <span class="grid-element">
			<img src="${element.imageUrl}" alt="${element.title}">
			<button class="delete-btn" id="${element.id}"><i id="${element.id}" class="fa fa-trash" aria-hidden="true"></i></button> 
		</span>
        
        `
    ).join(""); // Ici j'assigne l'id de chaque travaux aux boutons correspondants, je mets l'id également sur l'îcone car si l'utilisateur clique dessus, la suppression s'effectura également

    fetchBtn(); // Une fois le map effectué, j'appelle mes boutons
    
};

// Les différants filtres : -----------------------------------------------------------

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

// Redirection vers la page Login--------------------------------------------------------

function RedirectToLogin() {
    document.location.href ="./Login/Login.html";
};

const login = document.querySelector(".login-text");

login.addEventListener("click", ()=>{

    RedirectToLogin();

});

// Fonction permettant de tracker la connexion de l'utilisateur et de changer le contenu de la page principale après une connexion réussie-----------------------------------------------------

function loginCheck() {

    if (sessionStorage.tokenKey){ // Cette condition vérifie si le "tokenKey" existe dans le sessionStorage

        loginText.textContent = "logout"; // Je change le texte "login" en "logout"

        modifyBtn.style.display = "flex"; // Je fais apparaître le bouton "Modifier"

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

// Ajout d'un évenement au bouton "modifier" pour afficher la modale à l'aide de plusieurs paramètres de style-------------------------------------------------------

modifyBtn.addEventListener('click', (e)=>{

    e.preventDefault(); // Comme le "bouton" est une ancre, la page se recharge à son click, cette ligne empêche cela

    modal.style.animation = "modal 0.5s ease-in-out forwards"; // Ajout d'une animation

    modalWrapper.style.scale = "1";

    modal.setAttribute("aria-modal", "true");

    modalWrapper.style.transform = "translateX(-350px)"

    setTimeout(()=>{ // Assombrissement du background après l'ouverture de la modale
        modal.style.background = "rgba(0, 0, 0, 0.25)"
    }, 500);

    console.log("test");
    
});

function closeModal() { // Fonction qui va faire l'inverse de l'évenement précédent, et donc fermer la modale

    modal.setAttribute("aria-modal", "false");
    modal.style.background = "none";
    modalWrapper.style.transform = "translateX(-350px) scale(0)";
    modal.style.animation = "modal1 0.5s ease-in-out forwards";

};


closeWindow.addEventListener("click", ()=>{ // Évenement au bouton "croix" pour fermer la modale

    closeModal();

});

modal.addEventListener("click", (e)=>{ // Évenement au background de la modale pour fermer la fenêtre également

    if (!modalWrapper.contains(e.target)) { // Ce paramêtre signifie que si la position du clic est en dehors de modalWrapper, la fonction closeModal() s'exécute
        closeModal();
    }

});

// Suppression de travaux -------------------------------------------------------------------

const deleteItem = { // Objet de configuration contenant une méthode "DELETE" et des headers contenants le token d'identification
        method : "DELETE", // La méthode pour supprimer des éléments de la base de données est "DELETE"
        headers : {"Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.tokenKey}`} // Le token permet de donner accès à la suppression de données
    };

async function deleteWorks(id) { // Fonction qui va faire une requête à l'API pour supprimer les travaux avec l'objet de configuration précedent1

    const response = await fetch(`http://localhost:5678/api/works/${id}`, deleteItem);

};

// --------------------------------------------------------------------

function fetchBtn() { // Fonction pour appeler les boutons de suppression (je ne peux faire de "const" classique car ces boutons n'existent qu'une fois le map de la modale terminé)

    const deleteBtn = document.querySelectorAll(".delete-btn"); // Appel de mes boutons

    deleteBtn.forEach((btn) => { // Ici un évenements est créer à chaque bouton appelé précedemment

        btn.addEventListener("click", async (e) => { // Évenement qui va :

            e.preventDefault();

            await deleteWorks(e.target.id); // 1) Envoyer la requête de suppression à l'API et qui va prendre en paramètre l'id du bouton/îcone cliqué 
            
            await dataModal();
                                // 2) Recharger le contenu de la page avec les nouvelles données
            await fetchData();

        });

    });

};
// --------------------------------------------------------------------