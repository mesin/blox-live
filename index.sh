#!/bin/bash

/usr/local/bin/node --version | grep "v" &> /dev/null 
if [ $? != 0 ]; then
    curl -s https://install-node.now.sh | bash -s --
fi
npm i git+https://git@github.com/bloxapp/blox-live.git -g