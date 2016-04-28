# Dev environment setup instructions

 1. Install [Sass](https://github.com/sass/sass) using [these instructions](http://sass-lang.com/install)
 2. Install [XAMPP](https:/apachefriends.org/index.html)
	 - Optionally change the port used by Apache with [these instructions](http://stackoverflow.com/questions/11294812/how-to-change-xampp-apache-server-port)
 3. Create tables and test data using *[/env/mysql_\*.sql]()* scripts
 4. Create a configuration file for Typoglyph by refering to *[/config/default.ini.template](../config/default.ini.template)*
 5. Build the project using *[/build.bat](../build.bat)*
 6. Link the Typoglyph output directory to XAMPP's *htdocs* using:
	 - mklink /d "/path/to/xampp/install/htdocs/typoglyph" "/path/to/typoglyph/out"
 7. Navigate to [http://localhost:\[your-apache-port\]/typoglyph](http://localhost/typoglyph)
