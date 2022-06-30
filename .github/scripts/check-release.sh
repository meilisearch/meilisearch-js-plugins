#!/bin/sh

# Checking if current tag matches the package version
current_tag=$(echo $GITHUB_REF | cut -d '/' -f 3 | tr -d ' ',v)

package_file_tag=$(grep '"version":' package.json | cut -d ':' -f 2- | tr -d ' ' | tr -d '"' | tr -d ',')
package_file_name='package.json'
version_file_tag=$(grep "PACKAGE_VERSION =" src/package-version.ts | cut -d "=" -f 2- | tr -d " " | tr -d "'")
version_file_name='src/package-version.ts'

if [ "$current_tag" != "$package_file_tag" ] || [ "$current_tag" != "$version_file_tag" ]; then
  echo 'Error: the current tag does not match the version in package file(s).'
  echo "$package_file_name: $current_tag vs $package_file_tag"
  echo "$version_file_name: $current_tag vs $version_file_tag"
  exit 1
fi

echo 'OK'
exit 0
