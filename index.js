
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const HtmlTableToJson = require('html-table-to-json');
var jsonDiff = require('json-diff')
const sound = require("sound-play");


let filePath = './storage'
let urlInput = 'https://coinmarketcap.com/new/'

setInterval(() => {
    getNewCoin()
}, 5000);


const getNewCoin = () => {

    axios.get(urlInput)

        .then(async response => {

            const $ = cheerio.load(response.data.toString());

            var table = '<table>'

            table += $('.deceFm > tbody').html();

            table += '</table>'

            const jsonTables = HtmlTableToJson.parse(table);


            let fileName = 'coin.json'

            let jsonFile = JSON.parse(fs.readFileSync(filePath + '/' + fileName), 'utf-8');


            var diffrentJson = jsonDiff.diffString(jsonFile, jsonTables.results);

            if (diffrentJson.includes('+')) {

                console.log('new coin !!!!!!!!!!!!!');

                sound.play(__dirname + "/storage/foo.mp3");

            }


            if (!fs.existsSync(filePath))
                fs.mkdirSync(filePath, { recursive: true });

            fs.writeFileSync(filePath + '/' + fileName, JSON.stringify(jsonTables.results, null, 4));

            console.log('ok!');

        })

}