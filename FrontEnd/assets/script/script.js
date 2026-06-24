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
			<button type="button" class="delete-btn" id="${element.id}"><i class="fa fa-trash" aria-hidden="true"></i></button> 
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
    document.location.href ="./login.html";
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

            sessionStorage.clear();

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

    modalWrapper.style.transform = "translateX(-350px)";

    setTimeout(()=>{ // Assombrissement du background après l'ouverture de la modale
        modal.style.background = "rgba(0, 0, 0, 0.25)"
    }, 500);
    
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

async function deleteWorks(id) { // Fonction qui va faire une requête à l'API pour supprimer les travaux avec l'objet de configuration précedent

    const response = await fetch(`http://localhost:5678/api/works/${id}`, deleteItem);

};

// --------------------------------------------------------------------

function fetchBtn() { // Fonction pour appeler les boutons de suppression (je ne peux faire de "const" classique car ces boutons n'existent qu'une fois le map de la modale terminé)

    const deleteBtn = document.querySelectorAll(".delete-btn"); // Appel de mes boutons

    deleteBtn.forEach((btn) => { // Ici un évenements est créer à chaque bouton appelé précedemment

        btn.addEventListener("click", async (e) => {

            console.log("testS");
            

            e.preventDefault();

            // Confirmation de la suppression
            const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

            if(!confirmation){
                return;
            };

            await deleteWorks(e.currentTarget.id);

            alert("Le projet a bien été supprimé !");

            // await deleteWorks(e.currentTarget.id); // Envoi de la requête de suppression à l'API et qui va prendre en paramètre l'id du bouton/îcone cliqué 
        });

    });

};

// Ajout de travaux -----------------------------------------------------

// Affichage du formulaire

const addPhoto = document.querySelector(".add-photo");
const titleModal = document.getElementById("modal-title");
const backArrow = document.querySelector(".back-arrow");
const newProject = document.querySelector(".new-project");
const formSubmit = document.getElementById("form-submit");

addPhoto.addEventListener("click", () => { // Évenement permettant de changer le contenu qui va afficher le formulaire dans la modale

    newProject.style.display = "flex";

    gridContainer.style.display = "none";

    titleModal.textContent = "Ajout photo";

    formSubmit.style.display = "block";

    addPhoto.style.display = "none";

    backArrow.style.display = "block";

});

backArrow.addEventListener("click", () => { // Évenement permettant de remettre le contenu de base dans la modale

    newProject.style.display = "none";

    gridContainer.style.display = "grid";

    titleModal.textContent = "Galerie photo";

    backArrow.style.display = "none";

    formSubmit.style.display = "none";

    addPhoto.style.display = "block";

    // Si l'utilisateur utilise la "backArrow" après avoir choisi un fichier alors les lignes suivantes vont retirer la balise img et faire réapparaître le bouton

    imgBackground.style.zIndex = "0";
    imgBackground.innerHTML = "";
    inputBtn.style.display = "flex";

});

// Effet après sélection du fichier 

const inputBtn = document.getElementById('input-btn');

const imgBackground = document.querySelector(".img-background");

const projectPhoto = document.getElementById('project-photo');

const titleProject = document.getElementById('title-project');

const categoryProject = document.getElementById('category-project');


let imgPreview; // Variable qui va contenir l'url que l'on va utiliser comme réference pour afficher le fichier choisi par l'utilisateur

let fileInput; // Variable qui va contenir le fichier choisi par l'utilisateur


projectPhoto.addEventListener("change", (e) => {

    const file = e.target.files[0]; // "e.target.files[0]" permet de pointer le fichier de l'input "file"

    fileInput = file; 

    imgPreview = URL.createObjectURL(file); // Création d'une url temporaire lié au fichier

    imgBackground.innerHTML = `<img class="preview-img" src="${imgPreview}"></img>`; // Affichage du fichier en "preview"
    
    imgBackground.style.zIndex = "2"; // L'image passe "devant" les éléments de l'input

    inputBtn.style.display = "none"; // Le bouton disparaît
    
});



// Envoi du formulaire



newProject.addEventListener("submit", async (e) => { // Évenement à l'envoi du formulaire
    
    e.preventDefault();

    const formData = new FormData(); // Création d'un nouvel objet formData (qui va contenir les valeurs du formulaire et les noms/valeurs correspondantes)

    formData.append("image", fileInput); // La fonction "append" permet d'ajouter des objets/paramètres à mon formData (ici le string "image" et le fichier de l'image sont ajoutés)
    formData.append("title", titleProject.value);
    formData.append("category", categoryProject.value);

    const createItem = { // Pour envoyer les données de mon formulaire, je suis obligé d'utilisé un formData et non un body en json

        method : "POST",
        headers : {"Authorization": `Bearer ${sessionStorage.tokenKey}`}, // Pas la peine de mettre "Content: multipart/form-data" donc il n'y que l'autorisation dans les headers "jwt"
        body : formData 

    };

    if(!titleProject.value){
        alert("Vous devez ajoutez un titre")
    };

    try{

        const response = await fetch("http://localhost:5678/api/works", createItem); // Envoi vers l'API avec createItem comme objet de configuration

        if(response.status === 500){
            alert("Vous n'avez pas rempli tous les éléments")
        }
        if(response.status === 401){
            alert("Vous n'êtes pas connecté !")
        }
        if(response.status === 201){
            alert("Le projet a bien été ajouté !")
        }
    } catch(error){

        alert("Problème de réseau !");
        console.log("Error : ", error);

    };

    // Reset du formulaire d'envoi
    newProject.reset();
    imgBackground.style.zIndex = "0";
    imgBackground.innerHTML = "";
    inputBtn.style.display = "flex";

});