### To change the version 

modify in app.json and package.json
## Things to remember for Dev mode
Comment down the expo updates part of code in UseEffect in index.tsx
## things to do before publishing APK
Uncomment the expo updates part of the code

## Run android development build
```
npx expo run:android
```

## send an OTA udpate
```bash
eas update --branch preview --message "Fixed updating part"
```

## build with expo server
```bash
eas build -p android --profile preview 
```
## Build locally 
```bash
eas build -p android --profile preview --local
```
- Must have all the required SDK installed 

9ff1670b-93a0-40eb-b6bf-d8c3ff2ea98a
