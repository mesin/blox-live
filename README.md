# Blox CLI for Staking
[<img src="https://www.bloxstaking.com/wp-content/uploads/2020/04/Blox-Staking_logo_blue.png" width="100">](https://www.bloxstaking.com/)

Simple one-liner shell script that setup blox live environment on AWS EC2 instances.

## Requirements

- Existed AWS account or [Sign up](https://portal.aws.amazon.com/billing/signup).
- [Create an IAM user](https://aws.amazon.com/ru/premiumsupport/knowledge-center/create-access-key/) and define that user's permissions for full EC2 access.
- [Create the access key](https://aws.amazon.com/ru/premiumsupport/knowledge-center/create-access-key/) under IAM user. Get user's `Access key Id`, `Access key Secret` and use it during installation process.

## Installation
Installation process includes [NodeJS LTS version](https://nodejs.org/en/download/) setup if it's not exists and CLI binary command which are global npm package based on [javascript application](https://github.com/bloxapp/blox-live/blob/master/app.js).

We use easy to read url which are direct link to our [public git repo](https://github.com/bloxapp/blox-live).
```bash
curl -s https://blox-live.now.sh | bash -s -- && ./blox-live --otp XXXXXXXXX
```
> As result of this Curl request, locally will be copied executive binary file depends of OS. This binary file was packaged by `pkg .` command with this repo content. Initial script inside binary file is `node app.js`.

> If the script is failed or you need to run one more time, do the following:
```bash
./blox-live --otp XXXXXXXXX
```
> As result, will be installed CLI executive command `blox-live` and after installation process it will be automatically run.

## Uninstall

Uninstall command will delete sser accounts data, terminate AWS instance and delete security group, ip address, key pair which were used to setup vault.
```bash
./blox-live uninstall
```

## Versioning

After you did some code changes, and before `git commit` change version in `package.json` based on rule x, y, z:
```
x - major release version (will be 1 when we move to prod)
y - big feature scopes (alpha, beta) will be 1 when alpha scope is done
z - small changes
```

## Build binaries

To generate binary files run the following command:
```bash
npm run build
```


## Available commands
```bash
"start:dev": "nodemon",
"build": "rimraf ./build && tsc && pkg .",
"start": "npm run build && node build/index.js",
"lint": "eslint '*/**/*.{js,ts,tsx}' --quiet"
```