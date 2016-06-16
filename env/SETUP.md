# Dev environment setup instructions

 1. Install [node.js](https://nodejs.org/en/) v4.4.4 (used by the build script, not by the application itself)
 2. Install [gulp.js](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) using `npm install --global gulp-cli`
 3. Install Apache2, MySql and PHP via [LAMP](https://help.ubuntu.com/community/ApacheMySQLPHP) or [XAMPP](https:/apachefriends.org/index.html)
	 - Optionally change the port used by Apache with [these instructions](http://stackoverflow.com/questions/11294812/how-to-change-xampp-apache-server-port)
 4. Create tables and test data using the provided *[/env/mysql_\*.sql]()* scripts
 5. Create a configuration file for Typoglyph by refering to *[/config/default.ini.template](../config/default.ini.template)*
 6. Build the project by running `gulp compile` from anywhere within the project directory
 7. Link the Typoglyph output directory to XAMPP's *htdocs* using `ln -s "/path/to/typoglyph/out" "/var/www/html"` or `mklink /d "/path/to/xampp/install/htdocs" "/path/to/typoglyph/out"`
 8. Navigate to [http://localhost:\[your-apache-port\]/](http://localhost/)
 9. Also verify the admin page is working [http://localhost:\[your-apache-port\]/admin](http://localhost/admin)
 