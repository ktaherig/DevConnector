# Summary

This is a fully-functional Full-Stack social network for portfolio demonstration purposes. The technologies it uses include:
* ExpressJS
* MongoDB (provided live by [mLab](https://mlab.com/))
* Mongoose
* Passport with JSON Web Token
* Validator
* BcryptJS
* ReactJS 16 with Redux
* Concurrently

This project is based on the "[MERN Stack Front To Back: Full-Stack React, Redux, & Node.js](https://www.udemy.com/mern-stack-front-to-back/)" Udemy course by [Brad Traversy](http://traversymedia.com)

In the root ("DevConnectorSocNet") directory, the Node server can be started via either `node server` or `npm start`, which are scripted to work exactly the same, or by typing either `nodemon` or `npm run server`, which will continually listen for changes, and are also scripted to do the same thing.

If you decide that you wish to clone the repository and run the app locally, you can run `npm install && npm run client-install` from the root folder to install all dependencies with one command, and then from the same location, run `npm run dev` to run both servers (the Back-End Node server and the Front-End ReactJS server) concurrently, as it is also scripted to do so in the package.json file.

Docs for the automatic usage of Gravatar images are at the [Node Gravatar GitHub page](https://github.com/emerleite/node-gravatar)
