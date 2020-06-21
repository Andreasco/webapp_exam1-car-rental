class User{

    constructor(id, username, hash, name) {
        if(id)
            this.id = id;

        this.username = username;
        this.hash = hash;
        this.name = name;
    }
}

module.exports = User;
