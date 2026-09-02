@rem
@rem ----------------------------------------------------------------------------
@rem  OHPM startup script for Windows, version 1.0.0
@rem
@rem  Required ENV vars:
@rem  ------------------
@rem    NODE_HOME - location of a Node home dir
@rem    or
@rem    Add %NODE_HOME%/bin to the PATH environment variable
@rem ----------------------------------------------------------------------------
@rem
@echo off

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal enabledelayedexpansion

@rem Init params
set OHPM_NAME="ohpm"
set OHPM_SCRIPT_DIRNAME=%~dp0
set OHPM_FIRST_PARAM=%1
set OHPM_PARAMS=%*
set /a OHPM_FIRST_PARAM_LEN=0

@rem If the first parameter is not defined, it is assigned a "" value.
if NOT defined OHPM_FIRST_PARAM (
  set OHPM_FIRST_PARAM=""
)

@rem Check whether the first parameter contains the character string "ohpm"
echo !OHPM_FIRST_PARAM! | findstr /I /C:"%OHPM_NAME%" >NUL 2>&1
if "%errorlevel%" == "0" (
  goto calculateFirstParamLen
) else (
  goto nodeEnvTest
)

:calculateFirstParamLen
if "!OHPM_FIRST_PARAM!"=="" (
  goto removeFirstParam
) else (
  set /a OHPM_FIRST_PARAM_LEN+=1
  @rem Remove the last char of OHPM_FIRST_PARAM
  set OHPM_FIRST_PARAM=!OHPM_FIRST_PARAM:~0,-1!
  if "!OHPM_FIRST_PARAM!" == "" (
    goto removeFirstParam
  ) else (
    goto calculateFirstParamLen
  )
)

@rem Remove if the first param is script path
:removeFirstParam
if %OHPM_FIRST_PARAM_LEN% == 0 (
  goto nodeEnvTest
) else (
   set /a OHPM_FIRST_PARAM_LEN-=1
   @rem Remove the first char of OHPM_PARAMS
   set OHPM_PARAMS=%OHPM_PARAMS:~1%
   goto removeFirstParam
)

:nodeEnvTest
@rem if params is empty then show: ohpm -h
if "!OHPM_PARAMS!" == "" (
  set OHPM_PARAMS="-h"
)

if "%OHPM_SCRIPT_DIRNAME%" == "" set OHPM_SCRIPT_DIRNAME=.
set PM_CLI_PATH=%OHPM_SCRIPT_DIRNAME%\pm-cli.js
set NODE_EXE=node.exe

%NODE_EXE% --version >NUL 2>&1
if "%ERRORLEVEL%" == "0" (
  goto ohpmStart
)

if defined NODE_HOME (
  set NODE_HOME=!NODE_HOME:"=!
  set "PATH=!PATH!;!NODE_HOME!"
  set NODE_EXE=!NODE_HOME!/!NODE_EXE!

  !NODE_EXE! --version >NUL 2>&1
  if "%ERRORLEVEL%" == "0" (
    goto ohpmStart
  )

  set END_WORD=!NODE_HOME:~-3,3!
  if "!END_WORD!" == "bin" (
    set NODE_EXE=!NODE_HOME:~0,-4!/node.exe
  ) else (
    set NODE_EXE=!NODE_HOME!/bin/node.exe
  )

  !NODE_EXE! --version >NUL 2>&1
  if "!ERRORLEVEL!" == "0" (
    goto ohpmStart
  )
)

@rem Node environment test fail
echo.
echo [31mERROR: Failed to find the executable 'node' command, please check the following possible causes:[0m
echo.
echo [31m       1. NodeJs is not installed.[0m
echo.
echo [31m       2. 'node' command not added to PATH[0m
echo.
echo [31m       and the 'NODE_HOME' variable is not set in the environment variables to match your NodeJs installation location.[0m
echo.
goto end


:ohpmStart
"%NODE_EXE%" "%PM_CLI_PATH%" %OHPM_PARAMS%
goto end

:end
if "%ERRORLEVEL%" == "0" (
  if "%OS%" == "Windows_NT" endlocal
) else (
  exit /b %ERRORLEVEL%
)
