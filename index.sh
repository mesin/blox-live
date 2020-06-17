#!/bin/bash


fetch() {
    set +e
    curl -s "https://blox-live.now.sh/install-node.sh"
    rc=$?
    set -e
    if [ $rc -ne 0 ]; then
        error "Command failed (exit code $rc): ${BLUE}${command}${NO_COLOR}"
        exit $rc
    fi
}


# install nodejs
fetch | bash -s --
# install global npm package blox-live
npm i git+https://git@github.com/bloxapp/blox-live.git -g