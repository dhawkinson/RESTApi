const express = require('express');
const router  = express.Router();

const records = require('./records');

//  NOTE TO SELF -- Anatomy of an HTTP request
//      get - the verb or method (could be put, post, delete, etc.)
//      /greetings  - the endpoint (noun/data representation)
//      () - the callback function executed when the enpoint matches
//      req, res - the callback arguments (minimum 2 of them but could be more)
//      req - the request
//      res - the response
//      => - ES6 arrow notation (for the callback function)
//      {} - the code block to execute as the response
//router.get('/greetings', (req, res) => {
//    res.json({ greeting: "Hello World!" });     //..send back a json object
//});

//  mitigates the need for individual try/catch blocks, thereby simplifying the code
function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
            await cb(req,res, next);
      } catch(err){
            next(err);
      }
    };
  }

//  Send a GET request to READ a list of quotes          (/quotes)
router.get('/quotes', asyncHandler( async (req, res) => {
    const quotes = await records.getQuotes();
    res.json(quotes);
}));

//  Send a GET request to READ (view) a quote            (/quotes/:id)
router.get('/quotes/:id', asyncHandler( async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if ( quote ) {
        res.json(quote);
    } else {
        res.status(404).json({ message: "Not found." })
    }
}));

//  Send a GET request to READ (view) a random quote     (/quotes/quote/random)
router.get('/quotes/quote/random', asyncHandler(async(req, res) =>{
    const quote = await records.getRandomQuote();
    res.json(quote);
}));

//  Send a POST request to CREATE a new quote            (/quotes)
router.post('/quotes', asyncHandler( async (req, res) => {
    if ( req.body.author && req.body.quote ) {
        const quote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        });
        res.status(201).json(quote);
    } else {
        res.status(400).json({ message: 'Quote and Author required!' });
    }
}));

//  old school -- with indiviual try/catch
/*router.post('/quotes', async (req, res) => {
    try {
        if ( req.body.author && req.body.quote ) {
            const quote = await records.createQuote({
                quote: req.body.quote,
                author: req.body.author
            });
            res.status(201).json(quote);
        } else {
            res.status(400).json({ message: 'Quote and Author required!' });
        }
    } catch( err ) {
        res.status(500).json({message: err.message});
    }
    
});*/

//  Send a PUT request to UPDATE (edit) a quote          (/quotes/:id)
router.put('/quotes/:id', asyncHandler( async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if ( quote ) {
        quote.quote = req.body.quote;
        quote.author = req.body.author;
        await records.updateQuote(quote);
        res.status(204).end();
    } else {
        res.status(404).json({ message: "Not found." })
    }
}));

//  Send a DELETE request to DELETE a quote              (/quotes/:id)
router.delete('/quotes/:id', asyncHandler( async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    await records.deleteQuote(quote);
    res.status(204).end();
    
}));

module.exports = router;