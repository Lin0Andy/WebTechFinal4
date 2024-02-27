const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const mongoose = require('mongoose')
const adminRouter = require('./routes/adminRouter')
const User = require("./models/User");
const Quiz = require('./models/Quiz')
const userLogRouter = require('./routes/userLog');
const dndRouter = require('./routes/dndRouter')
const requireAuth = require('./middleware/requireAuth');
const requireAdmin = require('./middleware/requireAdmin')
const methodOverride = require('method-override');
const axios = require("axios");
const Item = require("./models/Item");
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
const atlas_con_string = process.env.MONGODB_CON_STR;
const sessionSecret = process.env.SESSION_SECRET;
const triviaAPIURL = process.env.TRIVIA_API_URL;


app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('img'));
app.set('view engine', 'ejs');
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin || false;
    next();
});
app.use('/admin', adminRouter);
app.use('/user', userLogRouter);
app.use('/dnd', dndRouter);


mongoose.connect(atlas_con_string)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


app.get('/', (req, res) => {
    res.render('main')
})

app.get('/admin', requireAuth, requireAdmin, async (req, res) => {
    try {
        const currentUserId = req.session.userId;
        console.log(currentUserId)
        const users = await User.find({ _id: { $ne: currentUserId }, deletion_date: null });
        res.render('admin', { users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/addItem', requireAuth, requireAdmin, (req, res) => {
    res.render('addItem')
})

app.get("/items", requireAuth, async (req, res) => {
    const isAdmin = req.session.isAdmin;
    try {
        const items = await Item.find({ deletion_date: null });
        res.render('items', { items, isAdmin})
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/items", requireAuth, async (req, res) => {
    const item = new Item({
        category: req.body.category,
        amount: req.body.amount,
        price: req.body.price,
        images: [req.body.image1, req.body.image2, req.body.image3],
        names: req.body.names,
        descriptions: req.body.descriptions
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/items/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).send('Item not found');
        }

        res.render('updateItem', { item });
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.patch("/items/:id", requireAuth, requireAdmin, getItem, async (req, res) => {
    try {
        if (req.body.category != null) {
            res.item.category = req.body.category;
        }
        if (req.body.amount != null) {
            res.item.amount = req.body.amount;
        }
        if (req.body.price != null) {
            res.item.price = req.body.price;
        }
        if (req.body.images != null) {
            res.item.images = req.body.images;
        }
        if (req.body.names != null) {
            res.item.names = req.body.names;
        }
        if (req.body.descriptions != null) {
            res.item.descriptions = req.body.descriptions;
        }
        res.item.update_date = new Date();

        const updatedItem = await res.item.save();
        // res.json(updatedItem);
        res.redirect('/items')
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete("/items/:id", requireAdmin, requireAuth, getItem, async (req, res) => {
    try {
        res.item.deletion_date = new Date();
        await res.item.save();
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
async function getItem(req, res, next) {
    let item;
    try {
        item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.item = item;
    next();
}


app.get('/quiz', requireAuth, (req, res) => {
    res.render('quiz_main');
});

app.post('/quiz/start', requireAuth, async (req, res) => {
    const { difficulty, amount } = req.body;

    try {
        const response = await axios.get(`${triviaAPIURL}?amount=10&category=16&difficulty=${difficulty}&type=multiple`);
        const questions = response.data.results;

        const questionObjects = questions.map(q => ({
            question: q.question,
            correct_answer: q.correct_answer,
            incorrect_answers: q.incorrect_answers,
            user_answer: ''
        }));

        const quiz = new Quiz({
            difficulty: difficulty,
            questions: questionObjects,
            score: 0,
            username: req.session.username
        });


        await quiz.save();

        res.render('trivia_quiz', { quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/quiz/submit', requireAuth, async (req, res) => {
    const { triviaId, answers } = req.body;

    try {
        const quiz = await Quiz.findById(triviaId);

        if (!quiz) {
            return res.status(404).json({ message: 'Trivia not found' });
        } else if (quiz.score > 0) {
            res.render('score', { quiz })
        }


        quiz.questions.forEach((question, index) => {
            if (answers[index]) {
                question.user_answer = answers[index];
                if (answers[index] === question.correct_answer) {
                    quiz.score++;
                }
            }
        });

        await quiz.save();

        // res.json({ message: 'Answers submitted successfully', quiz });
        res.render('score', { quiz })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/quiz/top-scores', requireAuth, async (req, res) => {
    try {
        const topScores = await Quiz.find().sort({ score: -1 }).limit(10);
        res.render('top_scores', { topScores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});


app.use((req, res) => {
    res.status(404).send('404: Page not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app
