const express = require("express");
const fs = require("fs");
const app = express();

const productsInit = require('./assets/products.json');
app.use(express.json()); //Appel de la méthode express.json() pour parser

//Initialisation du fichier Json
const initializeJsonFile = async () => {
    try {
        await fs.promises.copyFile('./assets/products.json', './products.json');
        console.log('Fichier copié avec succès !');

        //récupération des données du fichier Json
        products = require('./products.json');

        console.log('Données chargées avec succès !');

        // Démarrer le serveur Express une fois que les données sont chargées
        app.listen(8080, () => {
            console.log('Serveur ouvert sur le port 8080');
        });
    } catch (err) {
        console.error('Erreur lors de l\'initialisation du fichier JSON :', err);
    }
};

let products;
initializeJsonFile();

//app.listen(8080, () => {  console.log('Serveur ouvert sur le port 8080') });

class Product {
    id;
    code;
    name;
    description;
    price;
    quantity;
    inventoryStatus;
    category;
    image;
    rating;
  };

// Fonction pour sauvegarder les modifications dans le fichier JSON
const saveChanges = (changes) => {
    fs.writeFile('./products.json', JSON.stringify(changes, null, 2), (err) => {
        if (err) {
            console.error('Erreur lors de la modification du fichier :', err);
            return;
        }
        console.log('Modifications faites avec succès');
    });
};

// Fonction de vérification du format des données du produit pour la méthode post
const verifyPostProductData = (data) => {
    const requiredFields = ['id', 'code', 'name', 'description', 'price', 'quantity', 'inventoryStatus', 'category', 'image', 'rating'];
    
    // Vérification que tous les champs requis sont présents
    for (let field of requiredFields) {
        if (!(field in data)) {
            return false;
        }
    }

    // Vérification qu'il n'y est pas de champs en trop
    for (let field in data) {
        if (!requiredFields.includes(field)) {
            return false;
        }
    }

    return true;
};

// Fonction de vérification du format des données du produit pour la méthode post
const verifyPatchProductData = (data) => {
    const requiredFields = ['code', 'name', 'description', 'price', 'quantity', 'inventoryStatus', 'category', 'image', 'rating'];
    
    // Vérification que tous les champs requis sont présents
    for (let field of requiredFields) {
        if (!(field in data)) {
            return false;
        }
    }

    // Vérification qu'il n'y est pas de champs en trop
    for (let field in data) {
        if (!requiredFields.includes(field)) {
            return false;
        }
    }

    return true;
};

//méthodes GET
app.get('/products', (req,res) =>
    {res.status(200).json(products.data)}
);

app.get('/products/:id', (req,res) =>{
    const id = parseInt(req.params.id);
    const product = products.data.find(product => product.id == id);

    res.status(200).json(product);
});

//méthode POST
app.post('/products', (req,res) => {

    const id = parseInt(req.body.id);
    let existingProduct = products.data.find(product => product.id === id);

    //Vérification qu'un produit avec une id similaire n'existe pas
    if (existingProduct) {
        return res.status(400).json({ message: "Cette ID est déjà utilisé" });
    }

    //Vérification que le produit ajouté a le bon format
    if (!verifyPostProductData(req.body)) {
        return res.status(400).json({ message: 'Les données du produit sont invalides.' });
    }

    products.data.push(req.body);

    saveChanges(products);
    res.status(200).json(products);
});

//méthode DELETE
app.delete('/products/:id', (req,res) => {
    const id = parseInt(req.params.id);
    let product = products.data.find(product => product.id === id);
    products.data.splice(products.data.indexOf(product),1);

    saveChanges(products);
    res.status(200).json(products);
});

//méthode PATCH
app.patch('/products/:id', (req,res) => {
    const id = parseInt(req.params.id);
    let product = products.data.find(product => product.id === id);

    //Vérification que le produit existe
    if (!product) {
        return res.status(404).json({ message: "Produit non trouvé." });
    }

    //Vérification que le produit a le bon format
    if (!verifyPatchProductData(req.body)) {
        return res.status(400).json({ message: 'Les données du produit sont invalides.' });
    }

    // Mise à jour des propriétés du produit
    for (let key in req.body) {
        if (key in product) {
            product[key] = req.body[key];
        }
    }

    saveChanges(products);
    res.status(200).json(product)
});

