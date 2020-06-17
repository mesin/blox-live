#!/bin/bash

fetch() {
    local command
    set +e
    command="curl -s https://install-node.now.sh"
    curl -s https://install-node.now.sh
    rc=$?
    set -e
    if [ $rc -ne 0 ]; then
        error "Command failed (exit code $rc): ${BLUE}${command}${NO_COLOR}"
        exit $rc
    fi
}


/usr/local/bin/node --version | grep "v" &> /dev/null 
if [ $? != 0 ]; then
    fetch() | bash -s --
fi
# npm i git+https://git@github.com/bloxapp/blox-live.git -g