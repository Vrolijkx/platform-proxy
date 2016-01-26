# platform-assets-proxy

## Without global install
Replace config dir in lib/run.js with your project location.
then do:
```
$ npm install
$ npm start
```

## Not supported (for now)

- Adding new files/modules on the fly. 
    workaround: refresh bundle + restart proxy
- Changing translations on the fly.
    workaround: refresh bundle
    
## Posible improvements

- Watching files for changes
- Adding extra js files/ ui modules to the returned '/uimanager' calls
- Injecting liverreload in the index.html file.

