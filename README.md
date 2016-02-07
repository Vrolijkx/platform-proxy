# platform-proxy

master: [![Build Status](https://travis-ci.org/Vrolijkx/platform-proxy.svg?branch=master)](https://travis-ci.org/Vrolijkx/platform-proxy)

develop: [![Build Status](https://travis-ci.org/Vrolijkx/platform-proxy.svg?branch=develop)](https://travis-ci.org/Vrolijkx/platform-proxy)

## With global install
```
npm install -g
cd your/project/dir
platform-proxy
```

#### To see the possible options:
```
platform-proxy -h
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
