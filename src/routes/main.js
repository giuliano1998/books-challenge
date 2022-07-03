const express = require('express');
const mainController = require('../controllers/main');
const loginMiddleware = require('../middlewares/loginMiddleware')
const registerMiddleware = require('../middlewares/registerMiddleware')
const guestMiddleware = require('../middlewares/guestMiddleware')
const router = express.Router();

router.get('/', mainController.home);


router.get('/books/detail/:id', mainController.bookDetail);

router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);

router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);

router.get('/users/register',guestMiddleware, mainController.register);
router.post('/users/register',registerMiddleware, mainController.processRegister);
router.get('/users/login',guestMiddleware, mainController.login);
router.post('/users/login',loginMiddleware, mainController.processLogin);
router.get('/users/logout',mainController.logout)

router.delete('/books/:id', mainController.deleteBook);
router.get('/books/edit/:id', mainController.edit);
router.put('/books/edit/:id', mainController.processEdit);


module.exports = router;