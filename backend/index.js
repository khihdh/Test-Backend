const express = require("express");
const fs = require("fs");
const app = express();

const products = require('./assets/products.json');

app.use(express.json()); //Call express.json() method to parse

app.listen(8080, () => {
    console.log('Server open on port 8080');
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
    const requiredFields = ['id', 'code', 'name', 'description', 'price', 'quantity', 'inventoryStatus', 'category', 'image', 'rating'];
    
    // Check that all required fields are present
    for (let field of requiredFields) {
        if (!(field in data)) {
            return false;
        }
    }

    // Check for excess fields
    for (let field in data) {
        if (!requiredFields.includes(field)) {
            return false;
        }
    }

    return true;
};

// Product data format verification function for the post method
const verifyPatchProductData = (data) => {
    const requiredFields = ['code', 'name', 'description', 'price', 'quantity', 'inventoryStatus', 'category', 'image', 'rating'];
    
    // Check that all required fields are present
    for (let field of requiredFields) {
        if (!(field in data)) {
            return false;
        }
    }

    // Check for excess fields
    for (let field in data) {
        if (!requiredFields.includes(field)) {
            return false;
        }
    }

    return true;
};

//GET methods
app.get('/products', (req,res) =>
    {res.status(200).json(products.data)}
);

app.get('/products/:id', (req,res) =>{
    const id = parseInt(req.params.id);
    const product = products.data.find(product => product.id == id);

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
