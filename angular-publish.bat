@echo off
REM Chuyển đến thư mục chứa project Angular của bạn
cd /d C:\Users\Administrator\Desktop\FE-Happy-Milk-Customer

REM Hiển thị phiên bản Node.js và npm (tùy chọn)
echo Node.js version:
node -v
echo npm version:
CALL npm version

REM Đồng bộ code từ nhánh main trên Git
echo Fetching latest code from main branch...
git fetch origin
git reset --hard origin/main

REM Cài đặt các dependencies (nếu cần thiết)
echo Installing dependencies...
CALL npm install

REM Kiểm tra lỗi của lệnh trước đó
IF %ERRORLEVEL% NEQ 0 (
    echo Error occurred during npm install
    pause
    exit /b %ERRORLEVEL%
)

REM Build project Angular
echo Building Angular project...
CALL ng build

REM Kiểm tra lỗi của lệnh build
IF %ERRORLEVEL% NEQ 0 (
    echo Error occurred during ng build
    pause
    exit /b %ERRORLEVEL%
)

REM Tạo nội dung cho file web.config
echo Creating web.config file...
(
  echo ^<?xml version="1.0" encoding="UTF-8"?^>
  echo ^<configuration^>
  echo   ^<system.webServer^>
  echo     ^<rewrite^>
  echo       ^<rules^>
  echo         ^<rule name="ReactRouter Routes" stopProcessing="true"^>
  echo           ^<match url=".*" /^>
  echo           ^<conditions logicalGrouping="MatchAll"^>
  echo             ^<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /^>
  echo             ^<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /^>
  echo             ^<add input="{REQUEST_URI}" pattern="^/(docs)" negate="true" /^>
  echo           ^</conditions^>
  echo           ^<action type="Rewrite" url="index.html" /^>
  echo         ^</rule^>
  echo       ^</rules^>
  echo     ^</rewrite^>
  echo   ^</system.webServer^>
  echo ^</configuration^>
) > "dist\fuse\browser\web.config"

IF EXIST "C:\inetpub\wwwroot\fe-customer-happy-milk" (
    echo Deleting existing files in fe-customer-happy-milk...
    CALL rmdir /s /q "C:\inetpub\wwwroot\fe-customer-happy-milk"
)

REM Tạo lại thư mục đích
CALL mkdir "C:\inetpub\wwwroot\fe-customer-happy-milk"

REM Sao chép các file đã build vào thư mục đích
echo Copying built files to fe-trade...
CALL xcopy "dist\fuse\*" "C:\inetpub\wwwroot\fe-customer-happy-milk" /s /e /y

REM Thông báo hoàn thành và dừng màn hình
echo Build completed. Press any key to exit.
pause
