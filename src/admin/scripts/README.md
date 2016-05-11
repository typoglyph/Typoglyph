Ideally, the end goal is to get the entire website cleaned up nicely using requirejs and jquery
etc. The new admin page, however, is a nice place to start.

The drawback is that for now, much functionallity is duplicated - it's both in this directory as
nice requirejs modules, and also under /src/scripts as horrible garbage.

Once the rest of the website is cleaned up a bit (using what's been done with the admin part as a
base), this directory should be migraged to /src/scripts.
