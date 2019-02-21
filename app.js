const express = require('express');
const app = express();

const routes  = require('./routes');

app.use(express.json());    //  tells express we expect requests to come in as json
app.use('/api', routes);

//  global Error handling -- no valid route matched
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
})

//  Global error routine
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

app.listen(3000, () => console.log('Quote API listening on port 3000!'));
