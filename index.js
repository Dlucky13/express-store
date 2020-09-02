const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const app = express()
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const User = require('./models/user')

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(async(req, res, next) => {
	try {
		const user = await User.findById('5f4e40729a4082305696a27a');
		req.user = user;
		next()
	} catch (e) {
		console.log(e);
	}
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/',homeRoutes);
app.use('/courses',coursesRoutes);
app.use('/add',addRoutes);
app.use('/card',cardRoutes);

const PORT = process.env.PORT || 1308

async function start () {
	try {
		const mongoDBUrl = `mongodb+srv://dmitriy:TSAQ2VHnwahMKtL@cluster0.ww5yi.mongodb.net/shop`
		await mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})

		const candidate = await User.findOne()
		if (!candidate) {
			const user = new User({
				email: 'dmitriy@dev',
				name: 'Dmitriy',
				cart: {items: []}
			})
			await user.save()
		}

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})
	} catch (e) {
		console.log(e)
	}

}

start()








