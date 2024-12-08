const axios = require('axios');
const cheerio = require('cheerio');
const Game = require('../models/gameModel');

const returnItemData = (item) => {

}

const scrapeBggGamesBulk = async () => {
    const url = 'https://boardgamegeek.com/xmlapi2/thing?id='
    const delay = 1000; // 1 second between requests
    const limit = 20; // 20 games per request

    const bulkWriteOps = [];

    const games = await Game.find({ bggScraped: false })
    .sort({ bggId: 1 })
    .limit(limit);

    const ids = games.map(game => game.bggId).join(',');

    
    console.log(ids);
}


module.exports = {
    scrapeBggGamesBulk,
}