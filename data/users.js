const mongoCollections = require("./mongoCollections");
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectID;

function idCheck(id) {
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
    async createUser(hashedPassword, name) {
        if (!hashedPassword) throw "You must provide a password."
        if (typeof hashedPassword != "string") throw "The password must be a string.";

        if (!name) throw "You must provide a name for the user."
        if (typeof name != "string") throw "The name type must be a string.";

        let id = ObjectId();

        let newUser = {
            _id: id,
            hashedPassword: hashedPassword,
            profile: {
                _id: id,
                name: name,
                prevSearches: [],
                likes: [],
                dislikes: []
            }
        };

        const userCollection = await users();

        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "Could not add user.";

        const newId = insertInfo.insertedId;

        const user = await this.get(newId);

        return user;
    },

    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async get(id) {
        id = idCheck(id);

        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });

        if (user === null) throw "No user has that id.";

        return user;
    },

    async removeUser(id) {
        id = idCheck(id);

        const userCollection = await users();
        const data = await this.get(id);
        const deletionInfo = await userCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`;
        }

        let returnObj = {
            deleted: true,
            data
        }

        return returnObj;
    },

    //This will only update name and password
    async updateUser(id, updatedUser) {
        id = idCheck(id);
        const userCollection = await users();
        const currentUser = await this.get(id);
        const updatedUserData = { profile: {} };

        if (updatedUser.newPassword) {
            if (typeof updatedUser.newPassword != "string") throw "The new hash must be a string.";
            updatedUserData.hashedPassword = updatedUser.newPassword;
        } else {
            updatedUserData.hashedPassword = currentUser.hashedPassword;
        }

        if (updatedUser.newName) {
            if (typeof updatedUser.newName != "string") throw "The new name must be a string.";
            updatedUserData.profile._id = currentUser.profile._id;
            updatedUserData.profile.name = updatedUser.newName;
            updatedUserData.profile.prevSearches = currentUser.profile.prevSearches;
            updatedUserData.profile.likes = currentUser.profile.likes;
            updatedUserData.profile.dislikes = currentUser.profile.dislikes;
        } else {
            updatedUserData.profile._id = currentUser.profile._id;
            updatedUserData.profile.name = currentUser.profile.name;
            updatedUserData.profile.prevSearches = currentUser.profile.prevSearches;
            updatedUserData.profile.likes = currentUser.profile.likes;
            updatedUserData.profile.dislikes = currentUser.profile.dislikes;
        }

        let updateCommand = {
            $set: updatedUserData
        };
        const query = {
            _id: currentUser._id
        };

        const updatedInfo = await userCollection.updateOne(query, updateCommand);

        if (updatedInfo.modifiedCount === 0) {
            console.log("No changes were made.");
        }

        return await this.get(id);
    },

    //add previous search
    async addPrevSearch(id, search) {
        id = idCheck(id);
        if (!search) throw "You must provide a search for the user."
        if (typeof search != "string") throw "The search type must be a string.";

        updatedUser = await this.get(id);
        const userCollection = await users();
        updatedUser.profile.prevSearches.push(search);

        let updateCommand = {
            $set: updatedUser
        };
        const query = {
            _id: updatedUser._id
        };

        const updatedInfo = await userCollection.updateOne(query, updateCommand);

        if (updatedInfo.modifiedCount === 0) {
            console.log("No changes were made.");
        }

        return await this.get(id);
    },

    //add a like
    async addLike(id, product) {
        id = idCheck(id);
        if (!product) throw "You must provide a product for the user."
        if (typeof product != "string") throw "The product type must be a string.";

        updatedUser = await this.get(id);
        const userCollection = await users();
        updatedUser.profile.likes.push(product);

        let updateCommand = {
            $set: updatedUser
        };
        const query = {
            _id: updatedUser._id
        };

        const updatedInfo = await userCollection.updateOne(query, updateCommand);

        if (updatedInfo.modifiedCount === 0) {
            console.log("No changes were made.");
        }

        return await this.get(id);
    },

    //remove a like
    async removeLike(id, product) {
        id = idCheck(id);
        if (!product) throw "You must provide a product to be removed."
        if (typeof product != "string") throw "The product type must be a string.";

        updatedUser = await this.get(id);
        const userCollection = await users();

        let index = updatedUser.profile.likes.indexOf(product);
        if(index > -1){
            updatedUser.profile.likes.splice(index, 1);
        }else{
            throw "Product not found in likes";
        }
        
        let updateCommand = {
            $set: updatedUser
        };
        const query = {
            _id: updatedUser._id
        };

        const updatedInfo = await userCollection.updateOne(query, updateCommand);

        if (updatedInfo.modifiedCount === 0) {
            console.log("No changes were made.");
        }

        return await this.get(id);
    },

    //add a dislike
    async addDislike(id, product) {
        id = idCheck(id);
        if (!product) throw "You must provide a product for the user."
        if (typeof product != "string") throw "The product type must be a string.";

        updatedUser = await this.get(id);
        const userCollection = await users();
        updatedUser.profile.dislikes.push(product);

        let updateCommand = {
            $set: updatedUser
        };
        const query = {
            _id: updatedUser._id
        };

        const updatedInfo = await userCollection.updateOne(query, updateCommand);

        if (updatedInfo.modifiedCount === 0) {
            console.log("No changes were made.");
        }

        return await this.get(id);
    },

    //remove a dislike
    async removeDislike(id, product) {
        id = idCheck(id);
        if (!product) throw "You must provide a product to be removed."
        if (typeof product != "string") throw "The product type must be a string.";

        updatedUser = await this.get(id);
        const userCollection = await users();

        let index = updatedUser.profile.dislikes.indexOf(product);
        if(index > -1){
            updatedUser.profile.dislikes.splice(index, 1);
        }else{
            throw "Product not found in dislikes";
        }
        
        let updateCommand = {
            $set: updatedUser
        };
        const query = {
            _id: updatedUser._id
        };

        const updatedInfo = await userCollection.updateOne(query, updateCommand);

        if (updatedInfo.modifiedCount === 0) {
            console.log("No changes were made.");
        }

        return await this.get(id);
    }
};