const axios = require('axios');
const cheerio = require('cheerio');
const Game = require('../models/gameModel');


const scrape = async () => {
    const url = 'https://boardgamegeek.com/xmlapi2/thing?videos=1&id='
    const delay = 1; // 1 second between requests
    const limit = 20; // 20 games per request
    // wait for 1s between requests
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

    const totalGames = await Game.countDocuments({ bggScraped: false });
    console.log('Total games to scrape:', totalGames, 'Total requests:', Math.ceil(totalGames / limit));
    console.log('Estimated time left:', Math.ceil(totalGames / limit) * delay / 60, 'minutes');

    // there are 113904 games in game database
    // 5696 requests
    // 1 request per second
    // 1 request per 20 games

    // run with delay

    for (let i = 0; i < Math.ceil(totalGames / limit); i++) {
        const bulkWriteOps = [];

        const games = await Game.find({ bggScraped: false })
        .limit(limit);

        if (games.length === 0) return;

        const ids = games.map(game => game.bggId).join(',');

        console.log(`Ids: ${ids.split(',').length}`);

        const response = await axios.get(`${url}${ids}`);
        const $ = cheerio.load(response.data, { xmlMode: true });
console.log($('item').length, 'items found');
        $('item').each((i, item) => {
            const bggId = $(item).attr('id');
            const altNames = [];
        
            $(item).find('name[type="alternate"]').each((i, el) => {
                altNames.push($(el).attr('value'));
            });
        
            const description = $(item).find('description').text();
            const categories = [];
        
            $(item).find('link[type="boardgamecategory"]').each((i, el) => {
                categories.push($(el).attr('value'));
            });
        
            const thumbnail = $(item).find('thumbnail').text();
            const images = [];
        
            $(item).find('image').each((i, el) => {
                images.push($(el).text());
            });
        
            const tempDesigners = [];
            $(item).find('link[type="boardgamedesigner"]').each((i, el) => {
                tempDesigners.push($(el).attr('value'));
            });
            
            const tempArtists = [];
            $(item).find('link[type="boardgameartist"]').each((i, el) => {
                tempArtists.push($(el).attr('value'));
            });
        
            const videos = [];
            $(item).find('videos').find('video').each((i, el) => {
                videos.push({
                    title: $(el).attr('title'),
                    link: $(el).attr('link'),
                    category: $(el).attr('category'),
                    postedDate: $(el).attr('postdate'),
                });
            });
        
            const itemData = {
                bggId,
                altNames,
                description,
                categories,
                thumbnail,
                images,
                tempDesigners,
                tempArtists,
                videos,
                bggScraped: true,
            };

            bulkWriteOps.push({
                updateOne: {
                    filter: { bggId },
                    update: { $set: itemData },
                    upsert: true,
                },
            });
        });

        await Game.bulkWrite(bulkWriteOps);
        console.log(bulkWriteOps.length, ' done', 'of ' + games.length);
        // console.log('Bulk write complete', `Request ${i + 1} of 5696`, `Games scraped ${limit * (i + 1)}`);
    }
}


const scrapeBggGamesBulk = async () => {
    let delay = 2000;
    let retries = 10;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await scrape();
            return;
        } catch (error) {
            if (error.response && error.response.status === 429) { // Rate limit exceeded
                console.log(`Rate limit hit, retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 1.5; // Exponential backoff
            } else {
                throw error; // Other errors
            }
        }
    }
    throw new Error('Max retries exceeded.');
};

module.exports = {
    scrapeBggGamesBulk,
}