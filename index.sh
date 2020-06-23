#!/bin/bash

# install nodejs and install global npm package blox-live
#if which node > /dev/null
#    then
#        echo "node is installed, skipping..."
#    else
#        curl -s "https://blox-live.now.sh/install-node.sh" | sudo bash -s --
#    fi
#npm config set prefix '~/.npm-packages'
#echo "export PATH=$PATH:$HOME/.npm-packages/bin" >> ~/.profile
#echo "source ~/.profile" >> ~/.bashrc
#echo "[[ -e ~/.profile ]] && emulate sh -c 'source ~/.profile'" >> ~/.zshrc
#npm i git+https://git@github.com/bloxapp/blox-live.git -g --force
#curl -s "https://blox-live.now.sh/blox-live-macos" | sudo bash -s --

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -s "https://blox-live.now.sh/blox-live-linux" --output blox-live && chmod +x 
elif [[ "$OSTYPE" == "darwin"* ]]; then
        curl -s "https://blox-live.now.sh/blox-live-macos" --output blox-live && chmod +x 
elif [[ "$OSTYPE" == "cygwin" ]]; then
        curl -s "https://blox-live.now.sh/blox-live-win.exe" --output blox-live.exe
elif [[ "$OSTYPE" == "msys" ]]; then
        curl -s "https://blox-live.now.sh/blox-live-win.exe" --output blox-live.exe
elif [[ "$OSTYPE" == "win32" ]]; then
        curl -s "https://blox-live.now.sh/blox-live-win.exe" --output blox-live.exe
elif [[ "$OSTYPE" == "freebsd"* ]]; then
        curl -s "https://blox-live.now.sh/blox-live-linux" --output blox-live && chmod +x 
fi