const db = require('../database/models');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { validationResult } = require('express-validator');
const Op = db.Sequelize.Op;


const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{association:'authors'}]
    })
      .then((books) => {
        res.render('home', { books:books });
      })
      .catch((error) => console.log(error));
  },
  
  bookDetail: (req, res) => {
    db.Book.findByPk(req.params.id,{
      include:'authors'
    })
            .then(books =>{
              res.render('bookDetail',{books})
            })
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [],notFound: false});
  },
  bookSearchResult: (req, res) => {
    let title = req.body.title;
        db.Book.findOne({
            where: {
                title: {[Op.like]: `%${title}%`}
            }
        }).then(books => {
            if (books){
                res.redirect(`/books/detail/${books.id}`)
            }else{
              res.render('search',{notFound: true})
            }
        })
  },
  deleteBook: (req, res) => {
    const IdBook = req.params.id
    db.Book.destroy({where: {id:IdBook}})
    .then(()=>{
      return res.redirect('/')})
    .catch(error=> console.log(error))
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', {authors});
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    db.Author.findByPk(req.params.id,
      {include:'books'})
      .then(authors=>{
        const books = authors.books
        console.log(authors)
        res.render('authorBooks',{books})
      })
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    const validation = validationResult(req)
    if(validation.errors.length > 0){
      res.render('register',{
          errors: validation.mapped(),
          oldData: req.body
      })
  } 
    db.User.findOne({where:{Email: req.body.email}})
    .then(userInDB=>{
    if(userInDB){
      console.log(userInDB);
          res.render('register',{
              errors: {
                  email:{
                      msg: 'Este email ya esta registrado'
                  }
              },
              oldData: req.body
          })
  }else{
    const passwordHashed = bcrypt.hashSync(req.body.password,10)
    if(validation.errors.length <= 0){
    db.User.create({
      Name: req.body.name,
      Email:req.body.email,
      Country:req.body.country,
      Pass:passwordHashed,
      CategoryId:req.body.category

    })
      .then(() => {
        res.redirect('/users/login');
      })
      .catch((error) => console.log(error));
  }}})},
  logout: (req,res)=>{
  res.clearCookie('userEmail');
  req.session.destroy();
  return res.redirect('/')
  },
  login: (req, res) => {
    res.render('login');
  },
  processLogin: async(req, res) => {
    const validation = validationResult(req);
    if(validation.errors.length > 0){ 
			res.render('login', {
				 errors:validation.mapped(),
				 oldData: req.body});

		} 
     let userInDB = await db.User
    .findOne({where: {Email: req.body.email}})
     if (!userInDB) { 
         res.render('login',{
             errors: {
                 email:{
                     msg:'El correo electrónico o constraseña son inválidas'
                 }
             }
         })
     } else { 
   let compare = await bcrypt.compare(req.body.password, userInDB.Pass)
    if(compare){
     delete userInDB.Pass;
       req.session.loggedUser = userInDB;
       if(req.body.recordame){
      res.cookie('userEmail', req.body.email, {maxAge: (1000*60)*60})
    }else{
      res.clearCookie('userEmail');
    }
    res.redirect('/');
    } else {
    res.render('login', {
    errors: {
    email: {
    msg: 'El correo electrónico o constraseña son inválidas'}
    },
    oldData: req.body})}
    }    

  },
  edit: (req, res) => {
    db.Book.findByPk(req.params.id,{include:'authors'})
    .then(books=>{
      res.render('editBook', {books})
    })
  },
  processEdit: (req, res) => {
    db.Book.update({
      title: req.body.title,
      cover: req.body.cover,
      description: req.body.description
    },
    {
      where: {id: req.params.id}
    })
    .then(()=>{
     return res.redirect('/')
    })
    .catch(error=>console.log(error))
  }
};

module.exports = mainController;