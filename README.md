Backbone.Rebar
=====

Backbone.Rebar is an extension of the [Backbone](http://www.backbonejs.org/) library. It adds certain functionality that I have found to be useful in developing robust, extendable and maintainable web applications. It adds no additional dependencies to Backbone's and is only 3.4kb minified and gzipped.

# Installation

All you'll actually need is the backbone.rebar.js (development version) or the backbone.rebar.min.js (production version) from within this project. Once you have this file you can take a look at some of the examples to get an idea of how to start using the library.

# Building

The library source files are broken up into seperate files before a build is performed. You can see these files in the src directory. Rebar has a build process that you can run, but before you can do so you'll need to make sure that you have a few dependencies installed:

1. [Node](http://nodejs.org)
2. [GruntJS](http://gruntjs.com)
3. [PhantomJS](http://phantomjs.org/)

Once you have these dependencies installed run the following commands to build the library:

	$ mkdir rebar && cd rebar && git clone https://github.com/mcgaryes/backbone.rebar.git
	$ cd backbone.rebar/build/
	$ npm install
	$ grunt

# Examples

There are a number of examples within this git repository that you can use to see the available features of the library. Any example directory with a server.js JavaScript file within it is one that can be run as a local node server. You'll need to have node and npm installed on your computer to run these servers. Once you have these two dependencies you can run the following commands to start the examples:

	$ cd EXAMPLE_DIRECTORY
	$ npm install
	$ node server

After the server has been started you'll be notified with a port number. You can then open a browser and navigate to http://localhost:PORT.


# Features

### Application

The Application object adds boilerplate functionality for creating an application wide model, view (Composite View) and router (Dependency Router). It also contains functionality to load and apply bootstrap data to the Application instance's model.

### View

Very thin object that extends `Backbone.View` and adds `destory`, `transitionIn` and `transitionOut` functionality.

### Composite View

This object extends `Rebar.View` and adds functionality to manage the adding, rendering, removing and destroying of subviews.

### Mediator

The mediator object brings the power and the structure of the Mediator pattern. It manages conversations between multiple views and helps to decouple conversations between views and the rest of the application.

### Persistence Model

The persistence model object extends `Backbone.Model`. It overwrites the models `sync` method esentially rerouting the `fetch` and `save` methods to local storage. This is good for disposable data that you want to persist between user sessions or page refreshes.

### Dependency Router

The dependency router is set up a bit different than the Backbone.Router. The router only has two routes listed in its `routes` object:

* **handleNoHash** - Looks for a property called `landing` and automatically re-routes the user here to kick off the application.
* **handleAll** - A wildcard catch-all that will do a few things based on the route. Take for example the route `screens/screen/MyView/data/`. This will tell the router that the page should look in the screens directory, look for a file called screen.js, instantiate a backbone view named MyView and pass it a `routeData` JavaScript Array where `routeData[0]` equals `"data"`.

You can also add static routes via the `setStaticRoute` and `setStaticRoutes` methods on the router. This basically stores reference to the functionality you wish to preform with a user navigates to the associated URL hash.

### Controller

Very simple boilerplate object that extends `Backbone.Events`. More to come here.

### Logger

Console wrapper that looks to the Logger.Loglevel to determain whether or not it should actual call log, warn or error.

# API Documentation

For full api documentation reference the [api docs](http://mcgaryes.github.com/backbone.rebar/docs/index.html).
