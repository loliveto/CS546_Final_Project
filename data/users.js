const mongoCollections = require("./mongoCollections");
const users = mongoCollections.users;
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
        const updatedUserData = {profile: {}};

        if (updatedUser.newPassword){
            if (typeof updatedUser.newPassword != "string") throw "The new hash must be a string.";
            updatedUserData.hashedPassword = updatedUser.newPassword;
        } else{
            updatedUserData.hashedPassword = currentUser.hashedPassword;
        }
        
        if (updatedUser.newName){
            if (typeof updatedUser.newName != "string") throw "The new name must be a string.";
            updatedUserData.profile.name = updatedUser.newName;
            updatedUserData.profile.prevSearches = currentUser.profile.prevSearches;
            updatedUserData.profile.likes = currentUser.profile.likes;
            updatedUserData.profile.dislikes = currentUser.profile.dislikes;
        } else{
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
    }

    //add previous search

    //add a like

    //remove a like

    //add a dislike

    //remove a dislike
};