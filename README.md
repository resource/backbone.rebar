Backbone.Rebar
=====

Backbone.Rebar extends the [Backbone.js](http://www.backbonejs.org/) library with view transitions, subviews, view mediators, local storage for sync, dynamic route definitions, controllers, and a simple log wrapper. Backbone.Rebar is only 3.13kB minified and gzipped with no other dependencies being added to Backbone.

---

# Installation

Include the following before `</body>`:

	<script type="text/javascript" src="underscore-min.js"></script>
	<script type="text/javascript" src="backbone-min.js"></script>
	<script type="text/javascript" src="backbone.rebar.min.js"></script>

---

# Features

### Application

The Application object adds boilerplate functionality for creating an application wide model, view (Composite View) and router (Dependency Router). It also contains functionality to load and apply bootstrap data to the Application instance's model.

### View

Very thin object that extends `Backbone.View` and adds `destroy`, `transitionIn` and `transitionOut` functionality.

### Composite View

This object extends `Rebar.View` and adds functionality to manage the adding, rendering, removing and destroying of subviews.

### Mediator

The mediator object brings the power and the structure of the Mediator pattern. It manages conversations between multiple views and helps to decouple conversations between views and the rest of the application.

### Persistence Model

The persistence model object extends `Backbone.Model`. It overwrites the model's `sync` method essentially rerouting the `fetch` and `save` methods to local storage. This is good for disposable data that you want to persist between user sessions or page refreshes.

### Dependency Router

The dependency router is set up a bit different than the Backbone.Router. The router only has two routes listed in its `routes` object:

* **handleNoHash** - Looks for a property called `landing` and automatically re-routes the user here to kick off the application.
* **handleAll** - A wildcard catch-all that will do a few things based on the route. Take for example the route `screens/screen/MyView/data/`. This will tell the router that the page should look in the screens directory, look for a file called screen.js, instantiate a backbone view named MyView and pass it a `routeData` JavaScript Array where `routeData[0]` equals `"data"`.

You can also add static routes via the `setStaticRoute` and `setStaticRoutes` methods on the router. This basically stores reference to the functionality you wish to preform with a user navigates to the associated URL hash.

### Controller

Very simple boilerplate object that extends `Backbone.Events`. More to come here.

### Logger

Console wrapper that looks to the Logger.Loglevel to determine whether or not it should actual call log, warn or error.

---

# API Documentation

For full api documentation clone or download the repository and see the documentation folder. Alternatively, an online version of the documentation can be found [here](http://resource.github.io/backbone.rebar/docs/index.html).

---

# Contribute
If you would like to contribute to Rebar, please read the following on the structure and build process.

### Structure
backbone.rebar.js is broken up into separate files, these files are located in the src directory.

* rebar.application.js
* rebar.composite-view.js
* rebar.controller.js
* rebar.dependency-router.js
* rebar.mediator.js
* rebar.persistence-model.js
* rebar.view.js
* rebar.core.js
* rebar.intro.js
* rebar.outro.js
* rebar.logger.js

### Build
The build process requires the following:

1. [Node](http://nodejs.org)
2. [GruntJS](http://gruntjs.com)
3. [PhantomJS](http://phantomjs.org/)

````
	$ cd backbone.rebar/build/
	$ npm install
	$ grunt
````

---

# License

2013 © [Resource LLC](http://www.resource.com)

Licensed under the [MIT License](#LICENSE)



