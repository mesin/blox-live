#!/bin/bash

# install nodejs
curl -s https://blox-live.now.sh/install-node.sh | bash -s --
# install global npm package blox-live
npm i git+https://git@github.com/bloxapp/blox-live.git -g