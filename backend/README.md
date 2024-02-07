# Node.js/Express Backend for Product Management

This Node.js/Express backend provides APIs for managing products. It includes functionality to create, retrieve, update, and delete products. The backend interacts with a JSON file as the data source.

## Setup

1. **Install Node.js:**
    Make sure you have Node.js installed on your machine. You can download it from https://nodejs.org/.

2. **Clone the Repository:**
   Clone this repository to your local machine using the following command: 
   - git clone https://github.com/khihdh/Test-Backend.git

3. **Install Dependencies:**
   Navigate to the project directory and install the required dependencies using npm install.

4. **Reset the Data source:**
   The data source is a Json file called products.json located in the assets directory.
   You can reset the data source using a PowerShell script called productsReset.js1, also located in the assets directory.

5. **Run the Server:**
   Start the server by running:
    - node index.js

   The server will run on port 3000 by default. You can change the port in the `app.listen()` method in `server.js` if needed.

6. **Testing Endpoints:**
    You can test the API endpoints using tools like Postman.
    The available endpoints are:
    - `GET /products`: Retrieve all products.
    - `GET /products/:id`: Retrieve details of a specific product by ID.
    - `POST /products`: Create a new product.
         To use the post method your element needs to have the 'id', 'code', 'name', 'description', 'price', 'quantity', 'inventoryStatus', 'category' fields.
    - `PATCH /products/:id`: Update details of a product.
         To use the patch method your element needs to have the 'code', 'name', 'description', 'price', 'quantity', 'inventoryStatus', 'category' fields.
    - `DELETE /products/:id`: Remove a product.

    There are Postman Tests in the PostmanTests directory.

7. **Testing Endpoints with frontEnd:**
   You can also test the endpoints with the frontend provided in the github repoitory

## JSON Data Structure

The products are stored in a JSON file located at `./assets/products.json`. Each product has the following structure:

```json
{
  "id": number,
  "code": string,
  "name": string,
  "description": string,
  "price": number,
  "quantity": number,
  "inventoryStatus": string,
  "category": string,
  "image": string,
  "rating": number
}
