
# Cardano Wallet and Dapp Boilerplate

![Waller Preview](boost-wallet-preview.gif)

With ❤️ by [BOOST Stake Pool](https://twitter.com/BoostPool)

Try the [demo here](https://demo-wallet.boostpool.io/) 🚀


## Stack
#### Multiplatform: web, browser extension, mobile and desktop
- Typescript
- Reactjs
- Next.js
- Tailwind CSS
- Redux
- Translations with i18n
- Ionic Framework + Capacitor Mobile Starter
- Open data source: [Blockfrost API](https://docs.blockfrost.io/)
- Cardano Serialization Libs + [Mesh](https://mesh.martify.io/)
- IPFS Deployment with Fleek ```.fleek.json```

This repo is a conceptual starting point for building a multiplatform wallet or dapp. Based on [Capacitor boilerplate](https://github.com/mlynch/nextjs-tailwind-ionic-capacitor-starter).

Please note: this repo isn't quite production ready as-is. Users will want to setup the endpoints and network, check ``config.example.ts``.

## Usage

This project is a standard Next.js app, so the typical Next.js development process applies (`npm run dev` for browser-based development). However, there is one caveat: the app must be exported to deploy to iOS and Android, since it must run purely client-side. ([more on Next.js export](https://nextjs.org/docs/advanced-features/static-html-export))

Note: you will need a free Blockfrost Token ID or [Dandelion](https://blockfrost-api.testnet.dandelion.link) service by [PEACE Stake Pool](https://twitter.com/repsistance).

Build and export for all platforms:
```bash
    npm run build
    npm run export
```

All the client side files will be sent to the `./out/` directory. These files need to be copied to the native iOS and Android projects, and this is where Capacitor comes in:

### Platforms

#### Web
```bash
    npm run dev
```

#### Chromium Extension
```bash
    export LC_CTYPE=C
    export LANG=C
    mv ./out/_next ./out/next && cd ./out && grep -rli '_next' * | xargs -I@ sed -i '' 's|/_next|/next|g' @ && cd ..;
```

#### Mobile
```bash
    export LANG=en_US.UTF-8
    npx cap sync
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