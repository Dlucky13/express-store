const {Router} = require('express');
const Card = require('../models/card');
const Course = require('../models/course');
const router = Router();

router.post('/add', async(req,resp) => {
   const course = await Course.getById(req.body.id)
   await Card.add(course)
   resp.redirect('/card')
})

router.get('/', async (req,resp) => {
   const card = await Card.fetch();
   const {courses, price} = card;
   resp.render('card', {
      title: 'Card',
      isCard: true,
      courses,
      price
   })
})

router.delete('/remove/:id', async (req,resp) => {
   const card = await Card.remove(req.params.id);
   resp.status(200).json(card)
})


module.exports = router