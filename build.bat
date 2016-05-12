SET InputPath=src
SET OutputPath=out


REM Clean up old output
if exist "%OutputPath%" rmdir /s /q "%OutputPath%"

REM Copy source code to output folder
xcopy /v /f /i /e  "%InputPath%/*" %OutputPath%

REM Compile SASS files into CSS files
call node-sass "%OutputPath%/styles" --output "%OutputPath%/styles" --output-style compressed --recursive true --source-map true

REM Optimise JS files using requirejs
SET InputAdminScriptsPath=%InputPath%/admin/scripts
SET OutputAdminScriptsPath=%OutputPath%/admin/scripts
if exist "%OutputAdminScriptsPath%/module" rmdir /s /q "%OutputAdminScriptsPath%/module"
call r.js.cmd -o baseUrl="%InputAdminScriptsPath%/module" name="admin" out="%OutputAdminScriptsPath%/admin.js" mainConfigFile="%InputAdminScriptsPath%/requireConfig.js"

SET InputScriptsPath=%InputPath%/scripts
SET OutputScriptsPath=%OutputPath%/scripts
if exist "%OutputScriptsPath%/module" rmdir /s /q "%OutputScriptsPath%/module"
call r.js.cmd -o baseUrl="%InputScriptsPath%/module" name="index" out="%OutputScriptsPath%/index.js" mainConfigFile="%InputScriptsPath%/requireConfig.js"

pause
