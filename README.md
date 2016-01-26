# platform-assets-proxy

## Usage
Replace PLATFORM_PROJECT_DIR in lib/platform-assets-proxy-old.js with your project location.
then do:
```
$ npm install
$ npm run proxy
```

## Not supported (for now)

- Adding new files/modules on the fly. 
    workaround: refresh bundle + restart proxy
- Changing translations on the fly.
    workaround: refresh bundle
    
## Posible improvments

- Watching files for changes
- Adding extra js files/ ui modules to the returned '/uimanager' calls
- Injecting liverreload in the index.html file

