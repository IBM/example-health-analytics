#!/bin/bash -e
##############################################################################
# Copyright 2019 IBM Corp. All Rights Reserved.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
##############################################################################

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
