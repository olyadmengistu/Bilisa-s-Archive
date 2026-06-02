@echo off
echo Starting Bilisa Archive Demo Server...
echo.
echo The demo will be available at: http://localhost:8000/demo.html
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
