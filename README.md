
# Cardano Wallet and Dapp Boilerplate

![Waller Preview](boost-wallet-preview.gif)

With ❤️ by [BOOST Stake Pool](https://twitter.com/BoostPool)

Try the [demo here](https://demo-wallet.boostpool.io/) 🚀


## Stack
#### Multiplatform: web, browser extension, mobile and desktop
- Typescript
- Reactjs
- Webpack 5 
- Tailwind CSS
- Redux
- Translations with i18n
- Ionic Framework + Capacitor Mobile Starter
- Open data source: [Blockfrost API](https://docs.blockfrost.io/)
- Cardano Serialization Libs + [Mesh](https://mesh.martify.io/)
- IPFS Deployment with Fleek ```.fleek.json```

This repo is a conceptual starting point for building a multiplatform wallet or dapp. Based on [Capacitor boilerplate](https://github.com/rendyproklamanta/react-webpack-capacitor).

Please note: this repo isn't quite production ready as-is. Users will want to setup the endpoints and network, check ``config.example.ts``.

## Usage

Note: you will need a free Blockfrost Token ID or [Dandelion](https://blockfrost-api.testnet.dandelion.link) service by [PEACE Stake Pool](https://twitter.com/repsistance).

Build and export for all platforms:
```bash
    # Install
    npm i 
    # or
    npm i  --legacy-peer-dep
     
    # Run
    npm run dev
    # or
    yarn dev
    
    # For macos m1
    npm -g i sharp
```

All the client side files will be sent to the `./build/` directory. These files need to be copied to the native iOS and Android projects, and this is where Capacitor comes in:

### Platforms

#### Web
```bash
   yarn dev
```

#### Chromium Extension
```bash
1. Open chrome://extensions/ in chrome
2. Turn on Developer Mode.
3. Load ```build``` folder.
```

#### Mobile
```bash
    yarn buildcap
```

Finally, run the app:
```
    npx cap run ios
    npx cap run android
```

Or open Android Studio:
```
    npx cap open android
```
#### Desktop
Follow the instructions from the official site to setup [capacitor+electron](https://capacitor-community.github.io/electron/)
## Check Live logs
Open on browser and select ```inspect```:
```
    brave://inspect/#devices
```

## Livereload/Instant Refresh

To enable Livereload and Instant Refresh during development (when running `npm run dev`), find the IP address of your local interface (ex: `192.168.1.2`) and port your Next.js server is running on, and then set the server url config value to point to it in `capacitor.config.ts`:
```json
    {
      "server": {
        "url": "http://192.168.1.2:3000"
      }
    }
```

### Donations 🙏
In order to maintain and expand this project we accept donations in Ada to sustain the development.

Address: ```addr1qyh8r8a78d2wjj3g83tt7vre0fs4wseee6fte53ds58ujmu6hdn8zrnp37cqzdy3lctzgls7zlvt8skvvxcy2n3pcqxsnhk20u```

As an alternative, you can delegate and stake through [Boost Stake Pool](https://pooltool.io/pool/6b5179aee4db62de5bec35029e4c9b02145366acfec872f1594924db/epochs) ticker **BOOST**.
