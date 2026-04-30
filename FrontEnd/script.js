const gallery = document.querySelector(".gallery"); // Appel de la div "gallery" afin de la pointer facilement par la suite

// Fonction de Récupération de données

let contentData=[];

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