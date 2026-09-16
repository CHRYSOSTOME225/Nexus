const produitsParDefaut = [
    {
        id: 1,
        nom: "Smartphone",
        categorie: "Électronique",
        prix: 150000,
        stock: 8,
        image: "images/p1.jpg"
    },
    {
        id: 2,
        nom: "Écouteurs Bluetooth",
        categorie: "Électronique",
        prix: 25000,
        stock: 15,
        image: "images/p2.jpg"
    },
    {
        id: 3,
        nom: "Ordinateur portable",
        categorie: "Électronique",
        prix: 450000,
        stock: 5,
        image: "images/p3.jpg"
    },
    {
        id: 4,
        nom: "Polo homme",
        categorie: "Vêtements",
        prix: 12000,
        stock: 20,
        image: "images/p4.jpg"
    },
    {
        id: 5,
        nom: "Jean homme",
        categorie: "Vêtements",
        prix: 18000,
        stock: 12,
        image: "images/p5.jpg"
    },
    {
        id: 6,
        nom: "Sneakers",
        categorie: "Vêtements",
        prix: 25000,
        stock: 10,
        image: "images/p6.jpg"
    },
    {
        id: 7,
        nom: "Riz 5 kg",
        categorie: "Alimentaire",
        prix: 5500,
        stock: 30,
        image: "images/p7.jpg"
    },
    {
        id: 8,
        nom: "Huile végétale 1 L",
        categorie: "Alimentaire",
        prix: 1500,
        stock: 25,
        image: "images/p8.jpg"
    },
    {
        id: 9,
        nom: "Pâtes alimentaires",
        categorie: "Alimentaire",
        prix: 1000,
        stock: 40,
        image: "images/p9.jpg"
    },
    {
        id: 10,
        nom: "Sac de ciment 50 kg",
        categorie: "Bâtiment",
        prix: 5000,
        stock: 50,
        image: "images/p10.jpg"
    },
    {
        id: 11,
        nom: "Briques",
        categorie: "Bâtiment",
        prix: 500,
        stock: 200,
        image: "images/p11.jpg"
    },
    {
        id: 12,
        nom: "Carrelage",
        categorie: "Bâtiment",
        prix: 8000,
        stock: 35,
        image: "images/p12.jpg"
    }
];

let produits = JSON.parse(localStorage.getItem("nexusProduits"));

if (!produits || !Array.isArray(produits)) {
    produits = produitsParDefaut;
}

const formProduit = document.getElementById("formProduit");
const listeProduits = document.getElementById("listeProduits");
const recherche = document.getElementById("recherche");
const filtreCategorie = document.getElementById("filtreCategorie");
const imageInput = document.getElementById("image");
const apercuImage = document.getElementById("apercuImage");

function sauvegarderProduits() {
    localStorage.setItem("nexusProduits", JSON.stringify(produits));
}

function formaterPrix(prix) {
    return Number(prix).toLocaleString("fr-FR") + " F CFA";
}

function afficherProduits(liste = produits) {
    listeProduits.innerHTML = "";

    if (liste.length === 0) {
        listeProduits.innerHTML = `
            <div class="aucun-produit">
                Aucun produit trouvé.
            </div>
        `;
        return;
    }

    liste.forEach(function (produit) {
        const carte = document.createElement("article");
        carte.className = "produit-card";

        carte.innerHTML = `
            <img src="${produit.image}" alt="${produit.nom}">

            <div class="produit-info">
                <span class="produit-categorie">
                    ${produit.categorie}
                </span>

                <h3>${produit.nom}</h3>

                <p class="prix">
                    ${formaterPrix(produit.prix)}
                </p>

                <p class="stock">
                    Stock disponible : ${produit.stock}
                </p>

                <div class="actions">
                    <button onclick="modifierProduit(${produit.id})">
                        Modifier
                    </button>

                    <button onclick="supprimerProduit(${produit.id})">
                        Supprimer
                    </button>
                </div>
            </div>
        `;

        listeProduits.appendChild(carte);
    });
}

function mettreAJourStatistiques() {
    const totalProduits = produits.length;

    const totalStock = produits.reduce(function (total, produit) {
        return total + Number(produit.stock);
    }, 0);

    const totalValeur = produits.reduce(function (total, produit) {
        return total + Number(produit.prix) * Number(produit.stock);
    }, 0);

    document.getElementById("totalProduits").textContent = totalProduits;
    document.getElementById("totalStock").textContent = totalStock;
    document.getElementById("totalValeur").textContent =
        formaterPrix(totalValeur);
}

function filtrerProduits() {
    const texte = recherche.value.toLowerCase().trim();
    const categorie = filtreCategorie.value;

    const resultat = produits.filter(function (produit) {
        const correspondNom = produit.nom.toLowerCase().includes(texte);

        const correspondCategorie =
            categorie === "Toutes" || produit.categorie === categorie;

        return correspondNom && correspondCategorie;
    });

    afficherProduits(resultat);
}

imageInput.addEventListener("change", function () {
    const fichier = imageInput.files[0];

    if (!fichier) {
        apercuImage.innerHTML = "";
        return;
    }

    const lecteur = new FileReader();

    lecteur.onload = function (event) {
        apercuImage.innerHTML = `
            <img src="${event.target.result}" alt="Aperçu de l'image">
        `;
    };

    lecteur.readAsDataURL(fichier);
});

formProduit.addEventListener("submit", function (event) {
    event.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const categorie = document.getElementById("categorie").value;
    const prix = Number(document.getElementById("prix").value);
    const stock = Number(document.getElementById("stock").value);

    const modificationId = formProduit.dataset.modificationId;

    if (!nom || !categorie || prix < 0 || stock < 0) {
        alert("Veuillez remplir correctement tous les champs.");
        return;
    }

    if (modificationId) {
        const produit = produits.find(function (element) {
            return element.id === Number(modificationId);
        });

        if (produit) {
            produit.nom = nom;
            produit.categorie = categorie;
            produit.prix = prix;
            produit.stock = stock;

            const fichier = imageInput.files[0];

            if (fichier) {
                const lecteur = new FileReader();

                lecteur.onload = function (event) {
                    produit.image = event.target.result;
                    sauvegarderProduits();
                    afficherProduits();
                    mettreAJourStatistiques();
                    terminerModification();
                };

                lecteur.readAsDataURL(fichier);
                return;
            }
        }

        sauvegarderProduits();
        afficherProduits();
        mettreAJourStatistiques();
        terminerModification();

        return;
    }

    const fichier = imageInput.files[0];

    const nouveauProduit = {
        id: produits.length
            ? Math.max(...produits.map(function (produit) {
                return produit.id;
            })) + 1
            : 1,
        nom: nom,
        categorie: categorie,
        prix: prix,
        stock: stock,
        image: "images/p1.jpg"
    };

    if (fichier) {
        const lecteur = new FileReader();

        lecteur.onload = function (event) {
            nouveauProduit.image = event.target.result;
            produits.push(nouveauProduit);

            sauvegarderProduits();
            afficherProduits();
            mettreAJourStatistiques();
            formProduit.reset();
            apercuImage.innerHTML = "";
        };

        lecteur.readAsDataURL(fichier);
    } else {
        produits.push(nouveauProduit);

        sauvegarderProduits();
        afficherProduits();
        mettreAJourStatistiques();
        formProduit.reset();
        apercuImage.innerHTML = "";
    }
});

function modifierProduit(id) {
    const produit = produits.find(function (element) {
        return element.id === id;
    });

    if (!produit) {
        return;
    }

    document.getElementById("nom").value = produit.nom;
    document.getElementById("categorie").value = produit.categorie;
    document.getElementById("prix").value = produit.prix;
    document.getElementById("stock").value = produit.stock;

    formProduit.dataset.modificationId = id;

    apercuImage.innerHTML = `
        <img src="${produit.image}" alt="Image actuelle">
    `;

    document.querySelector(".btn-submit").textContent =
        "Enregistrer les modifications";

    document.getElementById("ajouter").scrollIntoView({
        behavior: "smooth"
    });
}

function terminerModification() {
    delete formProduit.dataset.modificationId;

    formProduit.reset();
    apercuImage.innerHTML = "";

    document.querySelector(".btn-submit").textContent =
        "Enregistrer le produit";
}

function supprimerProduit(id) {
    const confirmation = confirm(
        "Voulez-vous vraiment supprimer ce produit ?"
    );

    if (!confirmation) {
        return;
    }

    produits = produits.filter(function (produit) {
        return produit.id !== id;
    });

    sauvegarderProduits();
    afficherProduits();
    mettreAJourStatistiques();
}

recherche.addEventListener("input", filtrerProduits);
filtreCategorie.addEventListener("change", filtrerProduits);

const btnDeconnexion = document.getElementById("btnDeconnexion");

if (btnDeconnexion) {
    btnDeconnexion.addEventListener("click", function () {
        localStorage.removeItem("nexusConnecte");
        window.location.href = "connexion.html";
    });
}

afficherProduits();
mettreAJourStatistiques();