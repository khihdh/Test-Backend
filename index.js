const express = require("express");
const fs = require("fs");
const app = express();

const products = require('./products.json');
app.use(express.json()); //Appel de la méthode express.json() pour parser

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
const saveChanges = () => {
    fs.writeFile('./products.json', JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error('Erreur lors de la modification du fichier :', err);
            return;
        }
        console.log('Modifications faites avec succès');
    });
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
        products.data.push(req.body);

        saveChanges();
        res.status(200).json(products);
});

//méthode DELETE
app.delete('/products/:id', (req,res) => {
    const id = parseInt(req.params.id);
    let product = products.data.find(product => product.id === id);
    products.data.splice(products.data.indexOf(product),1);

    saveChanges();
    res.status(200).json(products);
});

//méthode PATCH
app.patch('/products/:id', (req,res) => {
    const id = parseInt(req.params.id);
    let product = products.data.find(product => product.id === id);

    product.code =req.body.code;
    product.name =req.body.name;
    product.description =req.body.description;
    product.price =req.body.price;
    product.quantity =req.body.quantity;
    product.inventoryStatus =req.body.inventoryStatus;
    product.category =req.body.category;
    product.image =req.body.image;
    product.rating =req.body.rating;

    saveChanges();
    res.status(200).json(product)
});


app.listen(8080, () => {  console.log('Serveur ouvert') });

