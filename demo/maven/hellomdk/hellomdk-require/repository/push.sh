#!/bin/bash
# copy and run this script to the root of the repository directory containing files
# this script attempts to exclude uploading itself explicitly so the script name is important
# Get command line params
REPO_URL=$1
USERNAME=$2
PASSWORD=$3
echo "maven repo url:$REPO_URL,username:$USERNAME,password:$PASSWORD"
find . -type f -not -path './mavenimport\.sh*' -not -path '*.sh' -not -path '*/\.*' -not -path '*/\^archetype\-catalog\.xml*' -not -path '*/\^maven\-metadata\-local*\.xml' -not -path '*/\^maven\-metadata\-deployment*\.xml' | sed "s|^\./||" | xargs -I '{}' curl --header 'User-Agent: Apache-Maven/3.6.3 (Java 11.0.16.1)' -u "$USERNAME:$PASSWORD" -X PUT -v -T {} $REPO_URL/{} ;
