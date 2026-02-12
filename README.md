Retractor
=========

Retractor is a Javascript application for exploring [retrograde analysis](https://janko.at/Retros/) chess problems (often
called retro problems) in your browser.
In a retro problem, you play chess backwards to deduce information about the history
of a game, such as what the last 5 moves were or on what square the black queen was captured.
A tutorial on retro problems is available in the application (see the "About" section
on the github page for a link to the currently hosted location).

If you would like to run the code locally, you should check out the repository and start a web browser in the repository
directory. If you have Python 3 installed, you can use `python -m http.server 8000` to start a web server
(for Python 2, use `python -m SimpleHTTPServer 8000`). Then open `http://localhost:8000/retractor.html` in your browser.
Opening the `retractor.html` file directly from your browser probably won't work, because of [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
restrictions for local files on the latest browsers.  If you really cannot get anything else to work, you can look up how 
to disable such restrictions in your browser, but this is not recommended.

If you want to run the tests, you should install [Jasmine](https://jasmine.github.io/). You want the standalone version
that can be run in a browser. Place the Jasmine installation in a directory called `jasmine` in the root directory of 
the repository. Then `http://localhost:8000/tests/test.html` will run the tests. The latest version of Jasmine that has
been verified to run the tests is 6.0.1. 