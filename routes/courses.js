const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', async(req, resp) => {
	const courses = await Course.find().lean()
		.populate('userId', 'email name')
		.select('title image price')

	// console.log(courses)
	resp.render('courses', {
		title: 'Courses',
		isCourses: true,
		courses
	})
})

router.get('/:id', async(req,resp) => {
	const course = await Course.findById(req.params.id).lean()  // передаем динамический параметр из пути
	resp.render('course', {
		layout: 'empty',
		title: `Course ${course.title}`,
		course
	})
})

router.get('/:id/edit', async(req, resp) => {
	if (!req.query.allow) {
		return resp.redirect('/')
	}

	const course = await Course.findById(req.params.id).lean()

	resp.render('course-edit', {
		title: `Edit ${course.title}`,
		course
	})
})

router.post('/edit', async (req, resp) => {
	const { id } = req.body
	delete req.body.id
	await Course.findByIdAndUpdate( id, req.body, {useFindAndModify: false})  //findByIdAndUpdate
	resp.redirect('/courses')
})


router.post('/remove', async (req,resp) => {
	try {
		await Course.deleteOne({ _id: req.body.id })
		resp.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
})

module.exports = router;