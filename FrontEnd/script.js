const gallery = document.querySelector(".gallery"); // Appel de la div "gallery" afin de la pointer facilement par la suite


// Appel de tous les inputs nécessaires au filtre
const filterAll = document.getElementById("all");
const filterObject = document.getElementById("objects");
const filterApartment = document.getElementById("apartments");
const filterHotel = document.getElementById("hotels");


console.log(filterAll);

let contentData=[];

// Fonction de Récupération de données

async function fetchData() {

    const response = await fetch('http://localhost:5678/api/works');

    contentData = await response.json();

    displayData(contentData);
}

// Fonction d'affichage de données 

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

// Les différants filtres

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


// Le filtres "Hôtels & Restaurants"
filterHotel.addEventListener("change", ()=>{

    filteredArray = contentData.filter((element) => element.category.id === 3);

    displayData(filteredArray);

});

fetchData();