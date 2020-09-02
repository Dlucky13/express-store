const {Router} = require('express');
const Course = require('../models/course')

const router = Router();

router.get('/', (req, resp) => {
	resp.render('add', {
		title: 'Add course',
		isAdd: true
	})
})

router.post('/', async(req,resp) => {
	const { title, price, image } = req.body
	const course = new Course({
		title,
		price,
		image,
		userId: req.user._id
	})

	try {
		await course.save()
		resp.redirect('/courses')
	} catch (e) {
		console.log(e)
	}

})

module.exports = router