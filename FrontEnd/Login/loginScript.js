// Redirection vers la page principale "non connectée"

const project = document.querySelector(".project-text");

project.addEventListener("click", ()=>{

    document.location.href ="../index.html";

});

// Connexion de l'utilisateur

const email = document.getElementById('emailLogin'); // Appel de l'input "email"

const password = document.getElementById('password'); //Appel de l'input "password"

const form = document.querySelector('.loginForm'); // Appel du formulaire

const wrongEmail = document.querySelector('.wrong-email');

const wrongPassword = document.querySelector('.wrong-password');

console.log(wrongEmail, wrongPassword);


// Évenement au submit du formulaire :

form.addEventListener("submit", async (e)=> {
    
    e.preventDefault(); // Cette ligne permet de submit le formulaire sans recharger la page

    // Objet contenant la valeur des inputs "email" et "password" :

    const userData = {
        email: email.value,
        password: password.value
    };
    
    // Format de l'objet de configuration, cet argument va permettre de renseigner les infos de l'utilisateur lors de notre requête :

    const object = {
        method : "POST", // La méthode pour envoyer des données à l'API est "POST"
        headers : {"Content-Type": "application/json"}, 
        body : JSON.stringify(userData) // Cette ligne est le contenu de l'objet, ici l'email et le mot de passe, j'utilise JSON.stringify pour transformer mon objet javascript en json
    };


    // Ici j'utilise une fonction try...catch pour vérifier le statut de la réponse de mon fecth

    try{

        const response = await fetch("http://localhost:5678/api/users/login", object); // 1) J'appelle mon fetch (avec l'objet de configuration) en await pour m'assurer d'avoir la réponse avant que la suite du script s'éxecute

        if (response.status === 401){ // 2) Si le statut de la réponse est une erreur 401, cela signifie que Utilisateur n'est pas autorisé, le mdp est donc incorrect
            wrongPassword.style.opacity = "1";
            return;
        }

        if (response.status === 404){ // 3) Si le statut de la réponse est une erreur 404, alors l'utilisateur n'a pas été trouvé dans la base de données 
            wrongEmail.style.opacity = "1";
            return;
        }

        if (response.status === 200){ // 4) Si le statut de la réponse est 200, alors l'accès est donné à l'utilisateur

            const data = await response.json(); // Je transforme la réponse en format json

            sessionStorage.tokenKey = data.token; // Je stocke mon token d'identification dans mon stockage de Session

            document.location.href = "../index.html"; // Enfin je redirige l'utilisateur vers la page principale qui va être modifié dû à la présence d'un objet dans le sessionStorage
            
        }

    } catch (error){ // Le catch permet d'afficher un message d'erreur si le fetch ne parvient pas à accéder à la base de données

        alert("Problème de réseau !");
        console.log("Erreur : ", error);
        
    }
    

});





