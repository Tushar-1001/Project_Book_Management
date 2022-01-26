const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const middleware = require("../middlewares/middlewares")

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)

router.post('/books',middleware.userAuth, bookController.createBook)
router.get('/books',middleware.userAuth, bookController.fetchAllBooks)
router.get('/books/:bookId',middleware.userAuth, bookController.fetchBooksById)
router.put('/books/:bookId',middleware.userAuth, bookController.updateBookDetails)
router.delete('/books/:bookId',middleware.userAuth, bookController.deleteBook)

router.post('/books/:bookId/review', reviewController.addReview)
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview)

module.exports = router;