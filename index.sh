#!/bin/bash

# curl -s "https://blox-live.now.sh/install-node.sh" | bash -s -- && 
# install nodejs and install global npm package blox-live
npm config set prefix ~/.local
echo 'PATH=~/.local/bin/:$PATH' >> ~/.bashrc
npm i git+https://git@github.com/bloxapp/blox-live.git -g