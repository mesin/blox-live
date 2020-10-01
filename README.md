[<img src="./internals/img/Blox-Staking-Banner.png" >](https://www.bloxstaking.com/)

<br>
<br>

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![Dependency Status][david-image]][david-url]
[![DevDependency Status][david-dev-image]][david-dev-url]
[![Github Tag][github-tag-image]][github-tag-url]
[![Discord](https://discord.com/api/guilds/723834989506068561/widget.png?style=shield)](https://discord.gg/HpT2z5B)

</div>

## Blox Staking - Desktop App
Blox is an open-source, fully non-custodial staking platform for Ethereum 2.0. The platform serves as an easy and accessible way to stake Ether and earn rewards on Eth2, while ensuring participants retain complete control over their private keys. Our goal at Blox is to simplify staking while ensuring Ethereum stays fair and decentralized. 

### Download
Download the app from https://www.bloxstaking.com/download

### Compatibility
- macOS
- Windows (soon)

## Development

BloxStaking app development run smoothly with [Yarn](https://classic.yarnpkg.com/)

### Install

```bash
yarn
```

### Build

```bash
yarn build
```

### Run development version

```bash
yarn dev
```

### Create packages

BloxStaking desktop app can run on MacOs and Windows(soon). You can create a package from your development enviroment. 

#### Pacakage for MacOS release

```bash
yarn package-mac
```

#### Pacakage for Windows release

```bash
yarn package-win
```
You can find the release files under release directory.

## Tech Stack

- <a href="https://www.electronjs.org">ElectronJS</a> To create a cross desktop app for all operating systems.
- <a href="https://expressjs.com/">Express</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://babeljs.io/">Babel</a> - For development purpose and build file creation
- <a href="https://reactjs.org/">React 16.8</a> - To handle front end tasks in scale
- <a href="https://reacttraining.com/react-router/web/guides/quick-start">React Router</a> - For application navigation and routing
- <a href="https://redux.js.org/">Redux</a> and <a href="https://redux-saga.js.org/">Redux Saga</a> - A UI state management and middleware to handle async operations
- <a href="https://github.com/axios/axios">Axios</a> - Promise based HTTP client
- <a href="https://styled-components.com/">Styled Components</a> - A CSS-in-JS library to make styling more dynamic and easy
- <a href="https://github.com/auth0/auth0.js#readme">Auth0 JS</a> - To authenticate and authorize users in the app
- <a href="https://www.typescriptlang.org/">TypeScript</a> and <a href="https://eslint.org/">ESlint</a> - For better development experience, linting errors, type checking, auto complete and more
- <a href="https://jestjs.io/">Jest JS</a> and <a href="https://reactjs.org/docs/test-renderer.html">React Test Renderer</a> - Testing tools for React applications
- <a href="https://coveralls.io/">Coveralls</a> - Code testing coverage 

## Docs (TBD)

See our [docs and guides here](https://www.bloxstaking.com/blox-blog/)

## Maintainers

- [David Marciano](https://github.com/david-blox)
- [Oleg Shmuelov](https://github.com/olegshmuelov)
- [Vadim Chumak](https://github.com/vadiminc)
- [Niv Muroch](https://github.com/nivBlox)
- [Lior Rutenberg](https://github.com/lior-blox)

## License

GPL © [Blox Live](https://github.com/bloxapp/blox-live)

[github-actions-status]: https://github.com/bloxapp/blox-live/workflows/Test/badge.svg?branch=stage	
[github-actions-url]: https://github.com/bloxapp/blox-live/actions	
[github-tag-image]: https://img.shields.io/github/v/tag/bloxapp/blox-live.svg?label=version	
[github-tag-url]: https://github.com/bloxapp/blox-live.svg/releases/latest	
[david-image]: https://david-dm.org/bloxapp/blox-live/stage/status.svg	
[david-url]: https://david-dm.org/bloxapp/blox-live/stage	
[david-dev-image]: https://david-dm.org/bloxapp/blox-live/stage/dev-status.svg	
[david-dev-url]: https://david-dm.org/bloxapp/blox-live/stage?type=dev	
