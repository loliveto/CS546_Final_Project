const mongoCollections = require("./mongoCollections");
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectID;

module.exports = {
    async createUser(hashedPassword, profile) {
        if (!hasedPassword) throw "You must provide a password."
        if (typeof hashedPassword != "string") throw "The password must be a string.";

        if (!profile) throw "You must provide a profile for the user."
        if (typeof profile != "object") throw "The profile type must be an object.";

        let newUser = {
            hashedPassword: hashedPassword,
            profile: profile
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

    async updateUser(id, updatedUser) {
        id = idCheck(id);
        const userCollection = await users();
        const currentUser = await this.get(id);
        const updatedUserData = {};

        if (updatedUser.newPassword){
            if (typeof updatedUser.newPassword != "string") throw "The new hash must be a string.";
            updatedUserData.hasedPassword = updatedUser.newPassword;
        } else{
            updatedUserData.name = currentUser.name;
        }
        
        if (updatedUser.newProfile){
            if (typeof updatedAnimal.newProfile != "object") throw "The new profile must be a object.";
            updatedUserData.profile = updatedUser.newProfile;
        } else{
            updatedUserData.profile = currentUser.newProfile;
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
};