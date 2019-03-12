#!/bin/bash -e
# shellcheck disable=SC1090
# shellcheck disable=SC2129
source "$(dirname "$0")"/../pattern-ci/scripts/resources.sh
main(){
    if ! docker-compose up -d; then
        test_failed "$0"
    elif ! docker-compose ps; then
        test_failed "$0"
    elif ! sleep 1 && cd generate && ./generate.sh; then
        test_failed "$0"
    else
        test_passed "$0"
    fi
}
main "$@" 
