#!/usr/bin/env bash
#
# Helper script for outputting XML validation warnings and errors.
#
# @author mikko.parviainen@fmi.fi, 2023
#

set -o errexit
set -o nounset
set -o pipefail

TEMP_FILE="$(mktemp)"

function cleanup() {
  rm --force "${TEMP_FILE}"
}
trap cleanup EXIT

function main() {
  find csection/ wms/ dali/ resources/ -type f ! -name '*.css' ! -name '*.json' ! -name '*.jsonc' ! -name 'LICENSE' ! -name '.*' -print0 | \
    xargs --no-run-if-empty --null --max-args=1 xmllint --noout > "${TEMP_FILE}" 2>&1 || \
    echo "Found XML errors:"

  if [[ -s "${TEMP_FILE}" ]]; then
   cat "${TEMP_FILE}"
   exit 1
 else
   echo "No XML errors found."
 fi
}

main
