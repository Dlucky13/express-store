const {Router} = require('express');
const Course = require('../models/course');
const user = require('../models/user')
const router = Router();


function mapCartItems(cart) {
   return cart.items.map(c => ({
      ...c.courseId._doc,
      id: c.courseId._id,
      count: c.count
   }) )
}

function computePrice(courses) {
   return courses.reduce((total,course) => {
      return total += course.price * course.count
   },0)
}

router.post('/add', async(req,resp) => {
   const course = await Course.findById(req.body.id)

   await req.user.addToCart(course)
   resp.redirect('/card')
})

router.get('/', async (req,resp) => {
   const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate()

   const courses = mapCartItems(user.cart)


   resp.render('card', {
      title: 'Card',
      isCard: true,
      courses,
      price: computePrice(courses)
   })
})

router.delete('/remove/:id', async (req,resp) => {
   await req.user.removeFromCart(req.params.id);
   const user = await req.user.populate('cart.items.courseId').execPopulate()

   const courses = mapCartItems(user.cart)
   const cart = {
      courses,
      price: computePrice(courses)
   }

   resp.status(200).json(cart)
})


module.exports = router