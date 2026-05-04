const gallery = document.querySelector(".gallery"); // Appel de la div "gallery" afin de la pointer facilement par la suite

// Fonction de Récupération de données

let contentData=[];

let objectsArray = [] , apartmentsArray = [] , hotelsArray = [];

const fetchData = async() => {
    await fetch('http://localhost:5678/api/works')
            .then((res)=> res.json())
            .then((data)=> contentData = data);
    console.log(contentData);
    
};


// Fonction d'affichage de données

async function contentDisplay() {

    await fetchData();

    gallery.innerHTML = contentData.map((project) => ( 
        
        `
        <figure>

            <img src="${project.imageUrl}" alt="${project.title}">
            <figcaption>${project.title}</figcaption>

        </figure>
        `

    )).join("");
    
};

contentDisplay();

// Partie Filtres

const filterData = async() => {

    await fetchData();

    for ( let i = 0; i < contentData.length - 1; i++){
        
        switch (contentData[i].category.id){

            case 1 :
                objectsArray.push(contentData[i]);
                break;
            case 2 :
                apartmentsArray.push(contentData[i]);
                break;
            case 3 :
                hotelsArray.push(contentData[i]);
            default :
                null;
        }
    }

    console.log(objectsArray, apartmentsArray, hotelsArray);
    

}

filterData();

// console.log(contentData[0].category.id);