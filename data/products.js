const mongoCollections = require("./mongoCollections");
const products = mongoCollections.products;
const ObjectId = require('mongodb').ObjectID;

module.exports = {
    async createProduct(productName, brand, effects, relatedProducts, price, reviews) {
        if (!productName) throw "You must provide a product name."
        if (typeof productName != "string") throw "The product name must be a string.";

        if (!brand) throw "You must provide a brand for the product."
        if (typeof brand != "string") throw "The brand type must be a string.";

        if (!effects) throw "You must provide a effects for the product."
        if (typeof effects != "list") throw "The effects type must be a list.";

        if (!relatedProducts) throw "You must provide related products for the product."
        if (typeof relatedProducts != "list") throw "The related products type must be a list.";

        if (!price) throw "You must provide a price for the user."
        if (typeof price != "number") throw "The price must be a number.";

        if (!reviews) throw "You must provide reviews for the user."
        if (typeof reviews != "list") throw "The reviews type must be a list.";

        let newProduct = {
            productName: productName,
            brand: brand,
            effects: effects,
            relatedProducts: relatedProducts,
            price: price,
            reviews: reviews
        };

        const productCollection = await users();

        const insertInfo = await productCollection.insertOne(newProduct);
        if (insertInfo.insertedCount === 0) throw "Could not add user.";

        const newId = insertInfo.insertedId;

        const product = await this.get(newId);
        return product;
    },

    async getAllProducts() {
        const productCollection = await products();
        const productList = await productCollection.find({}).toArray();
        return productList;
    },

    async get(id) {
        id = idCheck(id);

        const productCollection = await products();
        const product = await productCollection.findOne({ _id: id });

        if (product === null) throw "No product has that id.";

        return product;
    },

    async removeProduct(id) {
        id = idCheck(id);

        const productCollection = await products();
        const data = await this.get(id);
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

    async updateProduct(id, updatedProduct) {
        id = idCheck(id);
        const productCollection = await products();
        const currentProduct = await this.get(id);
        const updatedProductData = {};

        // productName: productName,
        //     brand: brand,
        //     effects: effects,
        //     relatedProducts: relatedProducts,
        //     price: price,
        //     reviews: reviews

        if (updatedProduct.newProductName){
            if (typeof updatedUser.newProductName != "string") throw "The new name must be a string.";
            updatedProductData.productName = updatedProduct.newProductName;
        } else{
            updatedUserData.productName = currentProduct.productName;
        }
        
        if (updatedProduct.newEffects){
            if (typeof updatedProduct.newEffects != "list") throw "The new effects must be a list.";
            updatedProductData.effects = updatedProduct.newEffects;
        } else{
            updatedProductData.effects = currentProduct.effects;
        }

        if (updatedProduct.newRelatedProducts){
            if (typeof updatedProduct.newEffects != "list") throw "The new related projects must be a list.";
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

        if (updatedProduct.newReviews){
            if (typeof updatedProduct.newReviews != "list") throw "The new review must be a list.";
            updatedProductData.reviews = updatedProduct.newReviews;
        } else{
            updatedProductData.reviews = currentProduct.reviews;
        }
        
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

        return await this.get(id);
    }
};