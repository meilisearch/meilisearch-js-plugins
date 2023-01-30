#!/bin/sh

# Checking if current tag matches the required formating
current_tag=$(echo $GITHUB_REF | cut -d '/' -f 3 | tr -d ' ',v)
echo $current_tag
# if push on not main
# pre.json should be present
#

# if [ $is_pre_release = false ]; then
#   # Works with the format vX.X.X, X being numbers
#   #
#   # Example of correct format:
#   # v0.1.0
#   echo "$current_tag" | grep -E "^[0-9]+\.[0-9]+\.[0-9]+$"
#   if [ $? != 0 ]; then
#     echo "Error: Your tag: $current_tag is wrongly formatted."
#     echo 'Please refer to the contributing guide for help.'
#     exit 1
#   fi
#   exit 0
# elif [ $is_pre_release = true ]; then
#   # Works with the format vX.X.X-**.X, X being numbers
#   #
#   # Examples of correct format:
#   # 0.2.0-pagination.1
#   # 0.2.0-v0.30.0-pre-release.0
#   echo "$current_tag" | grep -E "^[0-9]+\.[0-9]+\.[0-9]+-.*\.[0-9]*$"

#   if [ $? != 0 ]; then
#     echo "Error: Your beta tag: $current_tag is wrongly formatted."
#     echo 'Please refer to the contributing guide for help.'
#     exit 1
#   fi
#   exit 0
# fi

# exit 0
