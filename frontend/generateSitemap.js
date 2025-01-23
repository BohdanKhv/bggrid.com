import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

const hostname = 'https://increw.cafe';

const urls = [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/discover', changefreq: 'daily', priority: 0.9 },
    { url: '/hot', changefreq: 'daily', priority: 0.9 },
    { url: '/most-played', changefreq: 'daily', priority: 0.9 },
    { url: '/top-rated', changefreq: 'daily', priority: 0.9 },
    { url: '/best-selling', changefreq: 'daily', priority: 0.9 },
    { url: '/trending', changefreq: 'daily', priority: 0.9 },
    { url: '/new', changefreq: 'daily', priority: 0.9 },
    { url: '/best-for-2-players', changefreq: 'daily', priority: 0.9 },
    { url: '/best-for-families', changefreq: 'daily', priority: 0.9 },
    { url: '/best-for-parties', changefreq: 'daily', priority: 0.9 },
    { url: '/best-for-beginners', changefreq: 'daily', priority: 0.9 },
    { url: '/best-for-experts', changefreq: 'daily', priority: 0.9 },
    { url: '/for-you', changefreq: 'daily', priority: 0.9 },
    { url: '/g/:gameId', changefreq: 'daily', priority: 0.8 },
    { url: '/u/:username', changefreq: 'daily', priority: 0.8 },
    { url: '/terms', changefreq: 'monthly', priority: 0.8 },
    { url: '/privacy', changefreq: 'monthly', priority: 0.8 },
    { url: '/login', changefreq: 'monthly', priority: 0.8 },
];

const sitemapStream = new SitemapStream({ hostname });

urls.forEach(url => {
    sitemapStream.write(url);
});

sitemapStream.end();

streamToPromise(sitemapStream).then(data => {
    createWriteStream('./public/sitemap.xml').write(data.toString());
}).catch(err => {
    console.error('Error generating sitemap:', err);
});