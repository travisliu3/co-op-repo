const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let heroSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    id: String
});

let hero;

module.exports.connect = function (mongoDBConnectionString) {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString);

        db.on('error', err => {
            reject(err);
        });

        db.once('open', () => {
            hero = db.model("hero", heroSchema);
            resolve();
        });
    });
};

module.exports.getAllHeroes = function (name) {
    let findBy = name ? { name } : {};
    return hero.find(findBy).exec();
}

module.exports.getHeroById = function (id) {
    return hero.find({ id: id }).exec();
}

module.exports.addHero = async function (name) {
    const heroData = await hero.find().exec()

    const lastItem = heroData[heroData.length - 1];
    let id = Number(lastItem.id) + 1;
    let data = { id: id, name: name.name }

    const newHero = new hero(data);
    await newHero.save();
    return newHero;

}

module.exports.deleteHero = function (id) {
    return hero.deleteOne({ id: id }).exec();
}

module.exports.updateHero = function(data) {
    return hero.updateOne({ id: data.id }, { $set: data }).exec();
}