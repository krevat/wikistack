var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');

router.get('/', function(req, res, next) {
	Page.findAll()
	.then(function(pages){
		res.render('index', {pages: pages});
	});
	// res.send('got to GET /wiki/');
	// res.redirect('/');
	// res.json(req.body);
});

// submit a new page to the database
router.post('/', function(req, res, next){

	User.findOrCreate({
		where: {
			name: req.body.name,
			email: req.body.email
		}
	})
	.then(function (values) {
		var user = values[0];
	
		// res.json(req.body);
		var page = Page.build({
			title: req.body.title,
			content: req.body.content,
			status: req.body.status
		});

		return page.save()
		.then(function(page) {
			return page.setAuthor(user);
		});		
	})
	.then(function(newPage) {
	// res.json(req.body);
		res.redirect(newPage.route);
	})
	.catch(function(err){
		console.error(err);
	});
});

// retrieve the 'add a page' form
router.get('/add', function(req, res, next){
	res.render('addpage');
});

router.get('/users', function(req, res, next){
	User.findAll({}).then(function(users){
  	  	res.render('users', { users: users });
  	}).catch(next);
});

router.get('/users/:id', function(req, res, next){
	var userPromise = User.findById(req.params.id);
	var pagesPromise = Page.findAll({
		where: {
			authorId: req.params.id
		}
	});

	Promise.all([
		userPromise,
		pagesPromise
	])
	.then(function(values) {
		var user = values[0];
		var pages = values[1];
		res.render('user', {user: user, pages: pages });
	})
	.catch(next);

});

router.get('/:urlTitle', function(req, res, next){
	var urlTitle = req.params.urlTitle;

	Page.findOne({
		where: {
			urlTitle: urlTitle
		}
	})
	.then(function(foundPage){
		User.findById(foundPage.authorId)
		.then(function(user){
			res.render('wikipage', {title: foundPage.title,
				content: foundPage.content,
				user: user
			});
		})
		// res.json(foundPage);
	})
	.catch(function(err){
		console.error(err);
	});
});


module.exports = router;