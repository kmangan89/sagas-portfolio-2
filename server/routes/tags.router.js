const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/** -------- GETS TAGS FROM DATABASE ------- **/
router.get('/', (req, res) => {
    const queryText = 'SELECT * FROM "tags"';
    pool.query(queryText)
        .then((result) => { res.send(result.rows); })
        .catch((err) => {
            console.log('Error completing SELECT tags query', err);
            res.sendStatus(500);
        })
});


module.exports = router;