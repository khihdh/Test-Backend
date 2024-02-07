const express = require("express");
const fs = require("fs");
const app = express();
const cors = require('cors');

const products = require('./assets/products.json');

app.use(express.json()); //Call express.json() method to parse
app.use(cors());

app.listen(3000, () => {
    console.log('Server open on port 3000');
});

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

// Function to save changes in the JSON file
const saveChanges = (changes) => {
    fs.writeFile('./assets/products.json', JSON.stringify(changes, null, 2), (err) => {
        if (err) {
            console.error('Error while modifying file :', err);
            return;
        }
        console.log('Modifications made successfully');
    });
};

// Product data format verification function for the post method
const verifyPostProductData = (data) => {
    const requiredFields = ['id', 'code', 'name', 'description', 'price', 'quantity', 'inventoryStatus', 'category'];
    
    // Check that all required fields are present
    for (let field of requiredFields) {
        if (!(field in data)) {
            return false;
        }
    }

    return true;
};

// Product data format verification function for the post method
const verifyPatchProductData = (data) => {
    const requiredFields = ['code', 'name', 'description', 'price', 'quantity', 'inventoryStatus', 'category'];
    
    // Check that all required fields are present
    for (let field of requiredFields) {
        if (!(field in data)) {
            return false;
        }
    }

    return true;
};

//GET methods
app.get('/products', (req,res) =>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); //needed because otherwise angular won't accept the  answer
    res.status(200).json(products.data);
    console.log('Get method used');
});

app.get('/products/:id', (req,res) =>{
    const id = parseInt(req.params.id);
    const product = products.data.find(product => product.id == id);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); //needed because otherwise angular won't accept the  answer
    //Verify that the product exists
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
});

//POST Methods
app.post('/products', (req,res) => {

    const id = parseInt(req.body.id);
    let existingProduct = products.data.find(product => product.id === id);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); //needed because otherwise angular won't accept the  answer
    console.log("POST method used");

    //Check that a product with a similar id does not exist
    if (existingProduct) {
        return res.status(400).json({ message: "This ID is already used" });
    }

    //Check that the added product has the right format
    if (!verifyPostProductData(req.body)) {
        return res.status(400).json({ message: 'Product data is invalid' });
    }

    products.data.push(req.body);

    saveChanges(products);
    res.status(200).json(products);
});

//DELETE Methods
app.delete('/products/:id', (req,res) => {
    const id = parseInt(req.params.id);
    let product = products.data.find(product => product.id === id);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); //needed because otherwise angular won't accept the  answer
    console.log("DELETE method used");

    //Verify that the product exists
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    products.data.splice(products.data.indexOf(product),1);

    saveChanges(products);
    res.status(200).json(products);
});

//Patch Methods
app.patch('/products/:id', (req,res) => {
    const id = parseInt(req.params.id);
    let product = products.data.find(product => product.id === id);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); //needed because otherwise angular won't accept the  answer
    console.log("PATCH method used");

    //Verify that the product exists
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    //Check that the added product has the right format
    if (!verifyPatchProductData(req.body)) {
        return res.status(404).json({ message: 'Product data is invalid' });
    }

    // Update product properties
    for (let key in req.body) {
        if (key in product) {
            product[key] = req.body[key];
        }
    }

    saveChanges(products);
    res.status(200).json(product)
});

