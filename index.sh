#!/bin/bash

# install nodejs and install global npm package blox-live
# curl -s "https://blox-live.now.sh/install-node.sh" | bash -s -- && 
npm config set prefix '~/.npm-packages'
echo "export PATH=$PATH:$HOME/.npm-packages/bin" >> ~/.profile
echo "source ~/.profile" >> ~/.bashrc
echo "[[ -e ~/.profile ]] && emulate sh -c 'source ~/.profile'" >> ~/.zshrc
npm i git+https://git@github.com/bloxapp/blox-live.git -g