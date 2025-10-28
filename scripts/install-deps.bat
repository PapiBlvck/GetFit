@echo off
echo Installing GetFit dependencies...

REM Add Node.js to PATH for this session
set PATH=%PATH%;C:\Program Files\nodejs

echo Checking Node.js...
node --version
npm --version

echo Installing core dependencies...
npm install firebase zod @trpc/server @trpc/client @trpc/react-query @tanstack/react-query react react-dom react-hook-form @hookform/resolvers

echo Installing dev dependencies...
npm install -D typescript @types/node @types/react @types/react-dom eslint prettier vitest @testing-library/react @testing-library/jest-dom @types/jest tsx

echo Installation complete!
pause

