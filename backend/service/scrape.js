const axios = require('axios');
const cheerio = require('cheerio');
const Game = require('../models/gameModel');
const Person = require('../models/personModel');
const Publishers = require('../models/publisherModel');
const { typeEnum, themesEnum, mechanicsEnum } = require('../components/constants');


const scrape = async () => {
    const url = 'https://boardgamegeek.com/xmlapi2/thing?videos=1&stats=1&id='
    const delay = 1; // 1 second between requests
    const limit = 20; // 20 games per request


    const totalGames = await Game.countDocuments({bggScraped: false});
    console.log('Total games to scrape:', totalGames, 'Total requests:', Math.ceil(totalGames / limit));
    console.log('Estimated time left:', Math.ceil(totalGames / limit) * delay / 60, 'minutes');

    // there are 113904 games in game database
    // 5696 requests
    // 1 request per second
    // 1 request per 20 games

    // run with delay

    for (let i = 0; i < Math.ceil(totalGames / limit); i++) {
        // wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, delay * 250));
        const bulkWriteOps = [];

        const games = await Game.aggregate([
            { $match: { bggScraped: false } },
            { $sample: { size: limit } },
        ]);

        if (games.length === 0) return;

        const ids = games.map(game => game.bggId).join(',');

        console.log(`Ids: ${ids.split(',').length}`);

        const response = await axios.get(`${url}${ids}`);
        const $ = cheerio.load(response.data, { xmlMode: true });

        $('item').each((i, item) => {
            const bggId = $(item).attr('id');
            const altNames = [];
        
            $(item).find('name[type="alternate"]').each((i, el) => {
                altNames.push($(el).attr('value'));
            });

            const minPlayers = $(item).find('minplayers').attr('value') || 0;
            const maxPlayers = $(item).find('maxplayers').attr('value') || minPlayers || 0;
            const minplaytime = $(item).find('minplaytime').attr('value') || 0;
            const maxplaytime = $(item).find('maxplaytime').attr('value') || minplaytime || 0;
            const minage = $(item).find('minage').attr('value') || 0;
            const rating = $(item).find('statistics').find('ratings').find('average').attr('value');
            const numRatings = $(item).find('statistics').find('ratings').find('usersrated').attr('value');
            const numComments = $(item).find('statistics').find('ratings').find('numcomments').attr('value');
            const complexityWeight = $(item).find('statistics').find('ratings').find('averageweight').attr('value');
            
            const mechanics = [];
            $(item).find('link[type="boardgamemechanic"]').each((i, el) => {
                mechanics.push($(el).attr('value'));
            });

            const description = $(item).find('description').text();
            const categories = [];
        
            $(item).find('link[type="boardgamecategory"]').each((i, el) => {
                categories.push($(el).attr('value'));
            });
        
            const thumbnail = $(item).find('thumbnail').text();
            const images = [];
            let image = $(item).find('image').text();
        
            $(item).find('image').each((i, el) => {
                images.push($(el).text());
            });
        
            const altDesigners = [];
            $(item).find('link[type="boardgamedesigner"]').each((i, el) => {
                altDesigners.push($(el).attr('value'));
            });
            
            const altArtists = [];
            $(item).find('link[type="boardgameartist"]').each((i, el) => {
                altArtists.push($(el).attr('value'));
            });
            const altPublishers = [];
            $(item).find('link[type="boardgamepublisher"]').each((i, el) => {
                altPublishers.push($(el).attr('value'));
            });
        
            let videos = [];
            $(item).find('videos').find('video').each((i, el) => {
                videos.push({
                    title: $(el).attr('title'),
                    link: $(el).attr('link'),
                    category: $(el).attr('category'),
                    postedDate: $(el).attr('postdate'),
                    language: $(el).attr('language'),
                });
            });
            // Keep only english videos
            videos = videos.filter(video => video.language === 'English');
        
            const itemData = {
                bggId,
                // altNames,
                // description,
                categories,
                // thumbnail,
                // images,
                // minPlayers: parseInt(minPlayers),
                // maxPlayers: parseInt(maxPlayers),
                // minPlaytime: parseInt(minplaytime),
                // maxPlaytime: parseInt(maxplaytime),
                minAge: parseInt(minage),
                rating: parseFloat(rating),
                numRatings: parseInt(numRatings),
                numComments: parseInt(numComments),
                complexityWeight: parseFloat(complexityWeight),
                mechanics,
                // image,
                // altDesigners,
                // altArtists,
                // altPublishers,
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
    let retries = 1000;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await scrape();
            return;
        } catch (error) {
            if (error.response && error.response.status === 429) { // Rate limit exceeded
                console.log(`Rate limit hit, retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                // delay *= 1.5; // Exponential backoff
            } else {
                throw error; // Other errors
            }
        }
    }
    throw new Error('Max retries exceeded.');
};


const updateGamesInfo = async () => {
    const people = await Person.find();
    const allPublishers = await Publishers.find()
    const games = await Game.find({ publishers: { $exists: false } });

    const bulkWriteOps = [];

    games.forEach(game => {
        const designers = [];
        const artists = [];
        const publishers = [];
        const themes = game.themes || [];
        const types = game.types || [];

        game.altDesigners.forEach(name => {
            const person = people.find(person => person.name === name);
            if (person) designers.push(person._id);
        });

        game.altArtists.forEach(name => {
            const person = people.find(person => person.name === name);
            if (person) artists.push(person._id);
        });

        game.altPublishers.forEach(name => {
            const publisher = allPublishers.find(publisher => publisher.name === name);
            if (publisher) publishers.push(publisher._id);
        });

        // Check if categories match with types from typeEnum any match will be added to types
        game.categories.forEach(category => {
            if (typeEnum.includes(category)) types.push(category);
            if (themesEnum.includes(category)) themes.push(category);
        });

        bulkWriteOps.push({
            updateOne: {
                filter: { _id: game._id },
                update: { $set: { designers, artists, publishers, types, themes } },
            },
        });
    });

    console.log('saving games')

    await Game.bulkWrite(bulkWriteOps);

    console.log('Games updated');
}


const scrapeImages = async () => {
    // images
    const url = `https://api.geekdo.com/api/images?ajax=1&foritempage=1&galleries%5B%5D=game&nosession=1&objecttype=thing&showcount=17&size=crop100&sort=hot&objectid=316554`
    // for fulebook
    // https://api.geekdo.com/api/files?ajax=1&languageid=0&nosession=1&objectid=338960&objecttype=thing&pageid=1&showcount=25&sort=hot

    // videos 
    // https://api.geekdo.com/api/videos?ajax=1&gallery=all&languageid=0&nosession=1&objectid=338960&objecttype=thing&pageid=2&showcount=36&sort=recent
    const games = await Game.find({
        // les than 3 images
        images: { $size: 1 }
    })
    .sort({ numRatings: -1 })

    const bulkWriteOps = [];

    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const response = await axios.get(`https://boardgamegeek.com/boardgame/${game.bggId}`);
        const $ = cheerio.load(response.data);

        const images = [];
        $('#info').find('img').each((i, el) => {
            images.push($(el).attr('src'));
        });

        bulkWriteOps.push({
            updateOne: {
                filter: { _id: game._id },
                update: { $set: { images } },
            },
        });
    }
}

const runServices = () => {
    scrapeBggGamesBulk();
    // updateGamesInfo();
}

module.exports = {
    scrapeBggGamesBulk,
    updateGamesInfo,
    runServices
}