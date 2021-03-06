const mongoCollections = require("./mongoCollections");
const products = mongoCollections.products;
const ObjectId = require('mongodb').ObjectID;

function idCheck(id){
    if (!id) throw "You must provide an id.";
    if (typeof id === "string") {
        try {
            id = ObjectId(id);
        } catch (e) {
            throw "Please provide a valid ID.";
        }
    }
    return id;
}

module.exports = {
    async createProduct(productName, brand, effects, relatedProducts, price) {
        if (!productName) throw "You must provide a product name."
        if (typeof productName != "string") throw "The product name must be a string.";

        if (!brand) throw "You must provide a brand for the product."
        if (typeof brand != "string") throw "The brand type must be a string.";

        if (!effects) throw "You must provide a effects for the product."
        if (typeof effects != "object") throw "The effects type must be an object.";

        if (!relatedProducts) throw "You must provide related products for the product."
        if (typeof relatedProducts != "object") throw "The related products type must be an object.";

        if (!price) throw "You must provide a price for the product."
        if (typeof price != "number") throw "The price must be a number.";

        let newProduct = {
            productName: productName,
            brand: brand,
            effects: effects,
            relatedProducts: relatedProducts,
            price: price,
            reviews: [],
            image: "imagename"
        };

        const productCollection = await products();

        const insertInfo = await productCollection.insertOne(newProduct);
        if (insertInfo.insertedCount === 0) throw "Could not add product.";

        const newId = insertInfo.insertedId;

        const product = await this.getProductById(newId);
        return product;
    },

    async getAllProducts() {
        const productCollection = await products();
        const productList = await productCollection.find({}).toArray();
        return productList;
    },

    async getProductById(id) {
        id = idCheck(id);

        const productCollection = await products();
        const product = await productCollection.findOne({ _id: id });

        if (product === null) throw "No product has that id.";

        return product;
    },

    async removeProduct(id) {
        id = idCheck(id);

        const productCollection = await products();
        const data = await this.getProductById(id);
        const deletionInfo = await productCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete product with id of ${id}`;
        }

        let returnObj = {
            deleted: true,
            data
        }

        return returnObj;
    },

    //update anything except the reviews
    async updateProduct(id, updatedProduct) {
        id = idCheck(id);
        const productCollection = await products();
        const currentProduct = await this.getProductById(id);
        const updatedProductData = {};

        if (updatedProduct.newProductName){
            if (typeof updatedProduct.newProductName != "string") throw "The new name must be a string.";
            updatedProductData.productName = updatedProduct.newProductName;
        } else{
            updatedProductData.productName = currentProduct.productName;
        }
        
        if (updatedProduct.newEffects){
            if (typeof updatedProduct.newEffects != "object") throw "The new effects must be an object.";
            updatedProductData.effects = updatedProduct.newEffects;
        } else{
            updatedProductData.effects = currentProduct.effects;
        }

        if (updatedProduct.newBrand){
            if (typeof updatedProduct.newBrand != "string") throw "The new effects must be a string.";
            updatedProductData.brand = updatedProduct.newBrand;
        } else{
            updatedProductData.brand = currentProduct.brand;
        }

        if (updatedProduct.newRelatedProducts){
            if (typeof updatedProduct.newEffects != "object") throw "The new related projects must be an object.";
            updatedProductData.relatedProducts = updatedProduct.newRelatedProducts;
        } else{
            updatedProductData.relatedProducts = currentProduct.relatedProducts;
        }

        if (updatedProduct.newPrice){
            if (typeof updatedProduct.newPrice != "number") throw "The new price must be a number.";
            updatedProductData.price = updatedProduct.newPrice;
        } else{
            updatedProductData.price = currentProduct.price;
        }

        updatedProductData.reviews = currentProduct.reviews;
        
        let updateCommand = {
            $set: updatedProductData
        };
        const query = {
            _id: currentProduct._id
        };

        const updatedInfo = await productCollection.updateOne(query, updateCommand);

        if (updatedInfo.modifiedCount === 0) {
            console.log("No changes were made.");
        }

        return await this.gegetProductByIdt(id);
    },

    //add a review
    async addReview(id, poster, review) {
        id = idCheck(id);

        if(!poster) throw "You must provide a poster.";
        if(typeof poster != "object") throw "Poster must be an object.";

        if(!review) throw "You must provide a review.";
        if(typeof review != "string") throw "Review must be a string.";

        updatedProduct = await this.getProductById(id);
        const productCollection = await products();

        let reviewObj = {
            _id: ObjectId(),
            profile: poster,
            review: review
        }

        updatedProduct.reviews.push(reviewObj);

        let updateCommand = {
            $set: updatedProduct
        };
        const query = {
            _id: updatedProduct._id
        };

        const updatedInfo = await productCollection.updateOne(query, updateCommand);

        if (updatedInfo.modifiedCount === 0) {
            console.log("No changes were made.");
        }

        return await this.getProductById(id);
    },

    //remove a review
    async removeReview(prodId, revId) {
        id = idCheck(prodId);

        if(!revId) throw "You must provide a review ID.";
        if(typeof revId != "string") throw "Review ID must be a string.";

        updatedProduct = await this.getProductById(id);
        const productCollection = await products();

        let ind = 0;
        let revInd;
        updatedProduct.reviews.forEach(rev =>{
            let idstring = rev._id.toString();
            if(idstring === revId){
                revInd = ind;
            }
            ind = ind + 1;
        });

        if(!revInd) throw "Review not found";

        updatedProduct.reviews.splice(revInd, 1);
        
        let updateCommand = {
            $set: updatedProduct
        };
        const query = {
            _id: updatedProduct._id
        };

        const updatedInfo = await productCollection.updateOne(query, updateCommand);

        if (updatedInfo.modifiedCount === 0) {
            console.log("No changes were made.");
        }

        return await this.getProductById(id);
    }

};
