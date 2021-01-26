const fs = require('fs');
const http = require('http');
const url = require('url');

let data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const filmData = JSON.parse(data);
console.log(filmData);

const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    //overview lists of film
    if (pathName === '/lists' || pathName === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        fs.readFile(`${__dirname}/template/index-template.html`, 'utf-8', (err, data) => {
            let listOutput = data
            fs.readFile(`${__dirname}/template/card-template.html`, 'utf-8', (err, data) => {

                const cardOutput = filmData.map(el => replaceTemplate(data, el)).join('');
                listOutput = listOutput.replace('{%CARDS%}', cardOutput);

                res.end(listOutput);
            });
        });


    }
    //film card
    else if (pathName === '/film' && id < filmData.length) {

        res.writeHead(200, { 'Content-Type': 'text/html' });

        fs.readFile(`${__dirname}/template/film-preview-template.html`, 'utf-8', (err, data) => {
            const film = filmData[id];
            const output = replaceTemplate(data, film)

            res.end(output);
        });


    }

    else if ((/\.(jpg|jpeg|png|gif)$/i.test(pathName))) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {

            res.writeHead(200, { 'Content-Type': 'image/jpg' });

            res.end(data);
        });




    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Page Not Fond!');
    }


});

server.listen(1245, '127.0.0.1', () => {
    console.log('hey broos open the port 5500 now!')
});

function replaceTemplate(originalHtml, film) {
    let output = originalHtml.replace(/{%TITLE%}/g, film.title);
    output = output.replace(/{%IMAGE%}/g, film.image);
    output = output.replace(/{%HERO%}/g, film.hero);
    output = output.replace(/{%GENRE%}/g, film.Genre);
    output = output.replace(/{%CAST%}/g, film.cast);
    output = output.replace(/{%SYNOPSIS%}/g, film.synopsis);
    output = output.replace(/{%ID%}/g, film.id);

    return output;
}