const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

// connect to DB
db.connect();
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(methodOverride('_method'));
// http logger
app.use(morgan('combined'));

//  Template engine

app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            minus: (a,b) => a - b,
            sum: (a,b) => a + b,
            ifCond: (a,operator,b,options) => {
                switch (operator) {
                    case '==':
                        return (a == b) ? options.fn(this) : options.inverse(this);
                    case '===':
                        return (a === b) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (a != b) ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return (a !== b) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (a < b) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (a <= b) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (a > b) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (a >= b) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (a && b) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (a || b) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },
            times: (n, block) => {
                var accum = '';
                for(var i = 1; i <= n; ++i)
                    accum += block.fn(i);
                return accum;
            },

        }
    }),
    
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views')); // day la duong dan resources/views

route(app);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});