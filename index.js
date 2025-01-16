const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const PORT = 3000;

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);

            const links = [];
            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr('href');
                links.push(`https://es.wikipedia.org${link}`);
            });

            const data = []; // Almacena datos recopilados (la API)

            // Iterar sobre los links para obtener títulos, imágenes y textos
            for (const link of links) {
                try {
                    const pageResponse = await axios.get(link);
                    if (pageResponse.status === 200) {
                        const pageHtml = pageResponse.data; ///??? porque.data
                        const $$ = cheerio.load(pageHtml);

                        const title = $$('h1').text();
                        const imgs = [];
                        const texts = [];

                        $$('img').each((index, element) => {
                            const img = $$(element).attr('src');
                            imgs.push(img);
                        });

                        $$('p').each((index, element) => {
                            const text = $$(element).text();
                            texts.push(text);
                        });

                        // Agregar los datos de cada pagina a un objeto dentro de la API
                        data.push({ link, title, imgs, texts });
                    }
                } catch (err) {
                    console.error(`Error fetching data from ${link}:`, err.message);
                }
            }

            // Enviar los datos recopilados como respuesta JSON
            res.json(data);
        } else {
            res.status(response.status).send('Error fetching the main page.');
        }
    } catch (err) {
        console.error('Error fetching the main page:', err.message);
        res.status(500).send('Server error.');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));








/*

SIN DEVOLVER LOS VALORES EN LA CONSOLA A TRAVEZ DEL RES.SEND


const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const PORT = 3000;

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

app.get('/', (req, res) => {

    axios.get(url).then((response) => {
        if (response.status === 200) {
         const html = response.data
         const $ = cheerio.load(html)
          
         const links = []

         $('#mw-pages a').each((index, element) => {
            const link = $(element).attr('href')
            links.push(`https://es.wikipedia.org${link}`)
            })
        
        links.forEach(link => {
            axios.get(link).then((response) => {
                if (response.status === 200) {
                    const html = response.data
                    const $ = cheerio.load(html)

                    const titles = []
                    const imgs = []
                    const texts = []
            
                    $('h1').each((index, element) => {
                        const title = $(element).text()
                        titles.push(title)
                    })
                    
                    $('img').each((index, element) => {
                        const img = $(element).attr('src')
                        imgs.push(img)
                    })
            
                    $('p').each((index, element) => {
                        const text = $(element).text()
                        texts.push(text)
                    })
                    console.log(imgs)
                    
                    }
                })
        });
        }
    })

    res.send(console.log('hola'))

})


app.listen(PORT, () => {
    console.log(`Server is listening in http://localhost:${PORT}`)
})

 */