Почему Riot и почему нам нужна новая UI библиотека.

На Хабре уже упоминалась эта библиотека в переводе статьи [От React до Riot 2.0](http://habrahabr.ru/post/250205/) из блога ее разработчика. Я решил поделиться с вами [переводом](http://melnikov5.github.io/riotjs/) официальной [документации](https://muut.com/riotjs/) фреймворка и переводом небольшого урока.

## The react tutorial for riot

This tutorial is a copy of the features from the [react tutorial about building a comment section](http://facebook.github.io/react/docs/tutorial.html), but then for [riot](https://muut.com/riotjs/). Starting with react, it felt utterly complicated for small use cases and riot is a perfect, minimalistic alternative. Here I show you how it works.

The react tutorial builds a comment section with a few individual building blocks:

```
- CommentBox
  - CommentList
    - Comment
  - CommentForm
```

All these blocks will be built using riot with custom tags. To get an idea what this tutorial is about and you are unfamiliar with react, you should read the [react tutorial first](http://facebook.github.io/react/docs/tutorial.html). If you want to jump to the conclusion, the riot files are available in a [gist on GitHub](https://gist.github.com/juriansluiman/02e6da3b0e315cb5f9fd).

## Custom tags as building blocks

Let's start with a file `comments.tag` which will hold all custom tags for riot.

```
<comment-box>
  <h1>Comments</h1>

  <comment-list comments={ comments } />
  <comment-form />

  this.comments = []
</comment-box>

<comment-list>
  <comment each={ opts.comments } />
</comment-list>

<comment-form>
  <form>
    <input type="text" name="name">
    <textarea name="message"></textarea>
    <input type="submit" value="Post">
  </form>
</comment-form>

<comment>
  <div>
    <h2>My name</h2>
    <p>My message</p>
  </div>
</comment>
```

You might notice the syntax is like react JSX, as it is XML-ish with HTML and template-like sugar mixed. Foremost, it is important to notice all individual building blocks are like custom HTML tags: `<comment-box>` and so on.

A comment box is composed of a header, a list of comments and finishes with a form. A comment list is a block where the comment block is repeated for every comment there is. The comment itself contains the name of the author and the message s/he wrote.

The common pattern for riot tags is "HTML" first, javascript expressions later. The "HTML" can contain pure HTML, some riot-javascript expressions and other riot custom tags.

```
<my-tag>
  <h1>Some HTML</h1>
  <input name="foo" checked={ enabled } />
  <child-tag />

  var enabled = true;
</my-tag>
```

### Mount the components

Riot uses the term "mount" to attach the custom riot tags to your HTML page. The tag you want to load (in our case, the `<comment-box>`) is placed in your HTML and `riot.mount()` is called:

```
<html>
  <head>
    <title>Hello riot</title>
    <script src="http://cdn.jsdelivr.net/riot/2.0/riot.min.js"></script>
  </head>

  <body>
    <comment-box></comment-box>

    <script src="comments.js"></script>
    <script>riot.mount('comment-box')</script>
  </body>
</html>
```

The comment box is placed in the body and riot mounts the custom tag to the DOM. There is one final step to make this work...

### Compile the riot tag

The riot component definition started with a `comments.tag` and the HTML loads a `comments.js`. Riot must compile the tag file into plain javascript, using the riot compiler.

Install the compiler first:

```
npm install -g riot
```

Then use riot to compile the tag file:

```
riot path/to/comments.tag path/to/comments.js
```

Now use your browser to check the comment form! Only the form, you say? Yes, because there are no comments defined anywhere, the list is not populated and therefore completely absent.

## Use options and state

One of the features of riot is to pass on options and capture state of the component. The options can be set at `riot.mount()` or inside a component and they allow both to "push down" options to child components.

For example, take the `<comment-box>`'s header, which you can define during mount:

```
<comment-box>
  <h1>{ opts.title }</h1>
</comment-box>
```

```
riot.mount('comments-box', {title: 'Comments'});
```

All options which are passed onto the component from the caller, are containerized inside the `opts`. This holds true for child components too, which can obtain parameters via tag attributes (in this example, the comments):

```
<comment-box>
  <h1>{ opts.title }</h1>
  <comment-list comments={ comments } />

  this.comments = []
</comment-box>

<comment-list>
  console.log(opts.comments)
</comment-list>
```

### Component's state

In above example there is already some state hidden in the code. The "list" of comments is created inside the comment box. Holding state is one of the primarily concepts of riot (and react). When the state is updated, the "view" part is modified internally to comply with the new state.

Like react, riot has a virtual DOM. When the state changes, the virtual DOM updates itself. Next, riot compares the virtual DOM to the actual DOM of your document and updates all changes in bulk. This makes changes to the user interface very efficient.

Now let's build a comment section which keeps the state of comments in the browser's memory (causing all comments to disappear when you refresh the page). One of the first things is to let the comment box allow to add new comments:

```
<comment-box>
  <h1>{ opts.title }</h1>

  <comment-list comments={ comments } />
  <comment-form />

  this.comments = [];

  add(comment) {
    comments.push(comment)
    this.update()
  }
</comment-box>

<comment-form>
  <form onsubmit={ add }>
    <input type="text" name="name"
    <textarea name="message"></textarea>
    <input type="submit" value="Post">
  </form>

  add(e) {
    var comment = {
      name: this.name.value,
      message: this.message.value
    }

    this.parent.add(comment)
    e.target.reset()
  }
</comment-form>

<comment-list>
  <comment each={ opts.comments } name={ this.name } message={ this.message } />
</comment-list>

<comment>
  <div>
    <h2>{ opts.name }</h2>
    <p>{ opts.message }</p>
  </div>
</comment>
```

There are a few things happening here. First, the form has a submit handler, called add. When the form is submitted, the handler is executed. Riot directly calles `e.preventDefault()` which will cause the default action to halt (in this case, the form real submission).

Inside the add function (a ES6 notation which riot compiles into `this.add = function()`) the syntax `this.name` and `this.message` is used. This is a riot feature where all tags with a `name` or `id` attribute can be easily identified. Because the input and textarea holds both a name (respectively "name" and "message") you can access their values with `this.name.value` and `this.message.value`.

Then, `this.parent` is accessed. The `parent` key is the component's parent which is (duh) the parent of the `comment-form`. In fact, that is the `comment-box`. So `this.parent.add()` calls the `add()` method from the `comment-box`. This way, it allows you to change the state in the comment box from the comment form.

As third you might notice `e.target`. The e is the event object which is triggered on submit. This object holds a [few properties](https://muut.com/riotjs/guide/#event-handlers) and one is the target. Simply said, the tag which triggered the event (in this case, the `form`) is referenced via `e.target`. In the case of a form submission, it allows you to clear the form when a comment is "posted".

The last part is the `comment-box`'s `add()`. In here, two things happen. The state of comments is updated (simply push a new block onto the list of comments) and `this.update()` makes sure riot updates the virtual DOM and pushes the changes into the "real" DOM.

## Load and post comments

The final part is to use a server and persist the comments between different requests. I am not posting the server part, the react tutorial has some excellent servers written and they are [available in their repositories](https://github.com/reactjs/react-tutorial). Please note this tutorial uses a "name" and "message", but the react tutorial uses an "author" and "text". Update the server code if neccessary to use the new variable names.

There are two moments you need to create HTTP requests: to load comments and to post a new comment. Loading comments will happen at mount and then at a specified interval. So let's start with loading comments:

```
<comment-box>
  <h1>{ opts.title }</h1>

  <comment-list comments={ comments } />
  <comment-form url={ opts.url } />

  this.comments = []

  add(comment) {
    this.comments.push(comment)
    this.update()
  }

  load() {
    var request = new XMLHttpRequest, self = this

    request.open('GET', opts.url, true)
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        self.comments = JSON.parse(request.responseText)
        self.update()
      }
    }
    request.send()
  }

  load()
  setInterval(this.load, opts.interval)
</comment-box>
```

A simple XMLHttpRequest is executed (note, IE10+ syntax!). If the request is a success, the comments state is set again and an update is executed. This loading happens when the component is created and thereafter repeatedly after a specified interval. Note you have to add two new options (the url and interval):

```
riot.mount('comment-box', {
  title: 'Comments',
  url: '/comments.json',
  interval: 2000
}
```

### Post a comment optimistically

The second XMLHttpRequest is when the form is submitted. Previously we called `this.parent.add(comment)`, but now we're using the `comment` object to create a POST to the server as well. I called it "optimistically" because just before we are creating the request, the comment is already placed. This way, the user does not have to wait for the request to finish.

```
<comment-form>
  <form onsubmit={ add }>
    <input type="text" name="name">
    <textarea name="message"></textarea>
    <input type="submit" value="Post">
  </form>

  add(e) {
    var comment = {
      name:    this.name.value,
      message: this.message.value
    }

    this.parent.add(comment)
    this.post(comment, e.target)
  }

  post(comment, form) {
    var data = new FormData
    data.append('name', comment.name)
    data.append('message', comment.message)

    var request = new XMLHttpRequest()
    request.open('POST', opts.url, true)
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        form.reset()
        // You might want to flash a message now
      }
    }
    request.send(data)
  }
</comment-form>
```

A second method, `post()`, is defined to encapsulated the XMLHttpRequest. The request simply POST to the specified URL with the given form data. Note `FormData` is IE10+ only, so you might want to use a [compatibility layer](https://github.com/mattfawcett/form-data-compatibility) for older browsers.

In this new piece of code, the form is only reset after the message is sent successfully. The other parts are untouched (yah, components!).

The cool thing now is you can test the requests. Fire up two tabs in your browsers. Create a comment in one of them and notice how it pops up in the other one too.

## Conclusion

I hope you like riot as much as I do. It takes the component way of thinking from react (and polymer) but without a great amount of boilerplate code. It is easy to read and simple to use. And another great fact, it is fast! The library is also 24 *times smaller* than react.

Of course, react has much more to offer and is therefore way more complicated. Personally, I did not need the additional features. I just wanted to have small components for comments and live search (both coming soon!). For these small parts of a page, riot is a perfect choice.

The last thing is to put all code combined into a single `comments.tag` file. I put it for you in a [gist on GitHub](https://gist.github.com/juriansluiman/02e6da3b0e315cb5f9fd). This way you can easily compare the differences with the [react version of a comment box](https://github.com/reactjs/react-tutorial/blob/master/public/scripts/example.js).

### One more thing...

As you might notice I didn't do anything about validation and so on. No `request.onerror = function() {}`. No else when the server did report an error in the 4xx or 5xx range. No validation if all form fields are populated, etcetera etcetera.

Note this is a starters tutorial about how to use riot. If you want to use it in production, add some more validation, checks and messages. Be nice for your users.

## Disclaimer

I am not a javascript developer, but rather a back-end (non-node.js) developer. This is the reason I choose for riot (due it's easier syntax) but nevertheless there might be some oddities in above code. If you know more about javascript than me (which is quite likely) just [let me know](https://juriansluiman.nl/contact), I will update this tutorial accordingly.