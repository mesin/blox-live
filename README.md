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
curl -s https://blox-live.now.sh | bash -s -- && source ~/.profile && blox-live --otp 12345
```

> As result, will be installed CLI executive command `blox-live` and after installation process it will be automatically run.