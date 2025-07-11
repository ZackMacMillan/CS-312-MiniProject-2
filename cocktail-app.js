// cocktail-app.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/drink', async (req, res) => {
    try {
        const apiRes = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const beverage = apiRes.data.drinks[0];
        res.render('cocktail', { beverage });
    } catch (err) {
        console.error('Error fetching random cocktail:', err);
        res.render('errorPage', { message: 'Un oh awkward, that was not supposed to happen. Please try again.' });
    }
});

app.get('/search', async (req, res) => {
    console.log('Search route hit');
    const searchTerm = req.query.cocktailName;
    if (!searchTerm) {
        return res.render('errorPage', { message: 'Your desired Cocktail awaits.' });
    }

    try {
        const apiRes = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const foundDrink = apiRes.data.drinks ? apiRes.data.drinks[0] : null;

        if (foundDrink) {
            res.render('cocktail', { beverage: foundDrink });
        } else {
            res.render('errorPage', { message: 'No matching cocktail found. Did you just invent soemthing.' });
        }
    } catch (err) {
        console.error('Error during cocktail search:', err);
        res.render('errorPage', { message: 'Wow that was weird, Maybe try one more time.' });
    }
});

app.listen(PORT, () => {
    console.log(`MixMaster running at http://localhost:${PORT}`);
});
