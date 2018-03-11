# Build Script

```
# mkdir and init
mkdir next-pwa-app && cd $_
npm init -y

# install code packs
npm i next@latest react@latest react-dom@latest

# write first page
mkdir pages
touch pages/index.js
echo 'export default () => <div>Welcome to next.js with PWA!</div>' >> pages/index.js

# run next
add 'dev: next' to scripts in package.json
npm run dev
```
