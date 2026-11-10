@echo off
rem Drag the new game zip onto this file to publish it.
if "%~1"=="" (
  echo Drag the new game zip onto update.bat, or run: update.bat C:\path\pledge-split-v290.zip
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update.ps1" "%~1"
pause
