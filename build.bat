SET InputPath=src
SET OutputPath=out


REM Clean up old output
if exist %OutputPath% rmdir /s /q %OutputPath%

REM Copy source code to output folder
xcopy /v /f /i /e  "%InputPath%/*" %OutputPath%

REM Compile SASS files into CSS files
REM The SASS command seems to stop execution so make sure it's the last thing you do
cmd /k "sass --update %InputPath%/styles:%OutputPath%/styles"
