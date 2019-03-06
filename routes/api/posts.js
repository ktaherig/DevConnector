const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route			GET api/posts
// @description 	Fetch all posts
// @access			Public
router.get('/', (req, res) => {
	Post.find()
		.sort({date: -1})
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json({noPostsFound: "There are no posts on this channel."}));
});

// @route			GET api/posts/:id
// @description 	Fetch a single post by I.D.
// @access			Public
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.json(post))
		.catch(err => res.status(404).json({noPostFound: "This post either has been removed or does not exist"}));
});

// @route			POST api/posts
// @description 	Make a post on one's own profile
// @access			Private
router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
	const {errors, isValid} = validatePostInput(req.body);

	// Check Validation
	if(!isValid) {
		// If there are any errors, send a Status 400 with the errors object
		return res.status(400).json(errors);
	}

	const newPost = new Post({
		text: req.body.text,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id
	});

	newPost.save()
		.then(post => res.json(post))
});

// @route			DELETE api/posts/:id
// @description 	Delete a specific post
// @access			Private
router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
	/* The reason why we're using "findOne" here instead
	 * of "findById" is because "findById" finds by the
	 * post's I.D. and not the user I.D., and so anybody
	 * who's logged into the site can delete the post,
	 * whereas with "findOne", only the person who made
	 * the post can delete it (and anyone with admin rights)
	 */
	Profile.findOne({user:req.user.id})
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					// Check for the post owner
					if(post.user.toString() !== req.user.id) {
						return res.status(401).json({notAuthorized: "You cannot delete this post."})
					}

					// Delete
					post.remove()
						.then(() => res.json({success: true}))
						.catch(err => res.status(404).json({postNotFound: "This post either has already been deleted or does not exist."}));
				})
		})
});

// @route			POST api/posts/like/:id
// @description 	Like/upvote a post or comment
// @access			Private
router.post('/like/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
	Profile.findOne({user:req.user.id})
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					/* Here, we need to check to see if a particular user
					 * has already liked a particular post/comment. There
					 * are lots of ways to do this. In this specific
					 * project, we'll use the "filter" method.
					 */
					if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
						return res.status(400).json({alreadyLiked: "User has already given a like."})
					}

					// Add the user I.D. to the likes array
					post.likes.unshift({user: req.user.id});

					post.save().then(post => res.json(post));
				})
				.catch(err => res.status(404).json({postNotFound: "This post either has been deleted or does not exist."}));
		});
});

// @route			POST api/posts/unlike/:id
// @description 	Disunlike/de-upvote a post or comment
// @access			Private
router.post('/unlike/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
	Profile.findOne({user:req.user.id})
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
						return res.status(400).json({notYetLiked: "User has not yet given a like."})
					}

					// Remove the user I.D. from the likes array by user index
					const removeIndex = post.likes.map(item => item.user.toString())
						.indexOf(req.user.id);

					// Splice this user from the likes array
					post.likes.splice(removeIndex, 1);

					// Save the newly-redone array and write to disk
					post.save().then(post => res.json(post));
				})
				.catch(err => res.status(404).json({postNotFound: "This post either has been deleted or does not exist."}));
		});
});

// @route			POST api/posts/comment/:id
// @description 	Comment on a post
// @access			Private
router.post('/comment/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
	const {errors, isValid} = validatePostInput(req.body);

	// Check Validation
	if(!isValid) {
		// If there are any errors, send a Status 400 with the errors object
		return res.status(400).json(errors);
	}

	Post.findById(req.params.id)
		.then(post => {
			const newComment = {
				text: req.body.text,
				name: req.body.name,
				avatar: req.body.avatar,
				user: req.user.id
			}

			// Add this comment to the comments array
			post.comments.unshift(newComment);

			// Save the newly-redone comment array
			post.save().then(post => res.json(post))
		})
		.catch(err => res.status(404).json({postNotFound: "This post either has been deleted or does not exist."}));
});

// @route			DELETE api/posts/comment/:id/:comment_id
// @description 	Delete a particular comment on a post
// @access			Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session:false}), (req, res) => {
	Post.findById(req.params.id)
		.then(post => {
			// Check to see if the comment exists
			// We'll do this with the "filter" method
			if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
				return res.status(404).json({noSuchComment: "This comment either has already been deleted or does not exist."})
			}

			// Get the remove index
			const removeIndex = post.comments.map(item => item._id.toString())
				.indexOf(req.params.comment_id)

			// Splice the comment out of the array
			post.comments.splice(removeIndex, 1)

			// Save the newly-redone comment array
			post.save().then(post => res.json(post))
		})
		.catch(err => res.status(404).json({postNotFound: "This post either has already been deleted or does not exist."}));
});

module.exports = router;
