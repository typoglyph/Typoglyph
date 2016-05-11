# Dev environment setup instructions

 1. Install [node.js](https://nodejs.org/en/) v4.4.4 (used by the build script, not by the application itself)
 2. Install [node-sass](https://github.com/sass/node-sass) using ***npm install -g node-sass***
 3. Install [RequireJS Optimizer](https://requirejs.org/docs/optimization.html) using ***npm install -g requirejs***
 4. Install [XAMPP](https:/apachefriends.org/index.html)
	 - Optionally change the port used by Apache with [these instructions](http://stackoverflow.com/questions/11294812/how-to-change-xampp-apache-server-port)
 5. Create tables and test data using the provided *[/env/mysql_\*.sql]()* scripts
 6. Create a configuration file for Typoglyph by refering to *[/config/default.ini.template](../config/default.ini.template)*
 7. Build the project using *[/build.bat](../build.bat)*
 8. Link the Typoglyph output directory to XAMPP's *htdocs* using ***mklink /d "/path/to/xampp/install/htdocs/typoglyph" "/path/to/typoglyph/out"***
 9. Navigate to [http://localhost:\[your-apache-port\]/typoglyph](http://localhost/typoglyph)
