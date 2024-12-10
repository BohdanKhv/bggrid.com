const axios = require('axios');
const cheerio = require('cheerio');
const Game = require('../models/gameModel');
const { typeEnum, themesEnum } = require('../components/constants');


const func = async () => {
    const games = await Game.find();
console.log('start')
    const bulkWriteOps = []

    games.forEach(game => {
        const categories = game.categories;
        if (categories.length) {
            const types = game.types
            const themes = game.themes

            categories.forEach(category => {
                if (typeEnum.includes(category) && !types.includes(category)) {
                    types.push(category)
                } else if (themesEnum.includes(category) && !themes.includes(category)) {
                    themes.push(category)
                }
            })

            bulkWriteOps.push({
                updateOne: {
                    filter: { _id: game._id },
                    update: { $set: { types, themes } }
                }
            })
        }

    })

    await Game.bulkWrite(bulkWriteOps)
console.log('done')
}

module.exports = {
    func
}