#!/bin/bash -e
# shellcheck disable=SC1090
source "$(dirname "$0")"/../pattern-ci/scripts/resources.sh
main(){
    if ! docker-compose up -d; then
        test_failed "$0"
    fi
    if ! docker-compose ps; then
        test_failed "$0"
    fi
    if ! cd generate; then
        test_failed "$0"
    fi
    if ! ./generate.sh; then
    	test_failed "$0"
    fi

    test_passed "$0"
}
main "$@" 
