const express = require('express');
const axios = require('axios');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.get('/', requireAuth, (req, res) => {
    const language = req.query.lang || 'en';
    const loggedIn = req.session.username !== undefined ? true : false;

    try {
        res.render('dnd', { language, loggedIn });
    } catch (error) {
        console.error('Error fetching DND information:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/search', async (req, res) => {
    const spellName = req.query.spellName;

    try {
        const response = await axios.get('https://www.dnd5eapi.co/api/spells/');
        const spellList = response.data.results;
        const language = req.query.lang || 'en';
        const loggedIn = req.session.username !== undefined ? true : false;


        const spellItem = spellList.find(spell => spell.name.toLowerCase() === spellName.toLowerCase());

        if (spellItem) {
            const spellDetailsResponse = await axios.get(`https://www.dnd5eapi.co${spellItem.url}`);
            const spell = spellDetailsResponse.data;

            res.render('spellDetails', { spell, loggedIn, language });
        } else {
            res.send('Spell not found!');
        }
    } catch (error) {
        console.error('Error fetching spell details:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
