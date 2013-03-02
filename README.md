Backbone.Rebar
=====

Backbone.Rebar is an extension of the [Backbone](http://www.backbonejs.org/) library. It adds certain functionality that I have found to be useful in developing robust, extendable and maintainable web applications. It adds no additional dependencies to Backbone's and is only 3.4kb minified and gzipped.

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
