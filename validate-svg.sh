#!/usr/bin/env bash
#
# Helper script for outputting SVG validation warnings and errors.
#
# @author mikko.parviainen@fmi.fi, 2023
#

set -o errexit
set -o nounset
set -o pipefail

TEMP_DIR="$(mktemp --directory)"
NU_CHECKER_JAR="./node_modules/vnu-jar/build/dist/vnu.jar"

function cleanup() {
  if [[ -d "${TEMP_DIR}" ]]; then
    rm --recursive --force "${TEMP_DIR}"
  fi
}
trap cleanup EXIT

##
# Creates a full SVG file (copy) from the original SVG fragment file to $TEMP_DIR
#
function convert_to_full_svg() {
  local input_file="$1"
  local input_dir="$(dirname "$1")"
  local output_dir="${TEMP_DIR}/${input_dir}"
  local output_file="${TEMP_DIR}/${input_file}.svg"

  mkdir --parents "${output_dir}"

  cat << EOF > "${output_file}"
<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg">
EOF
  cat "${input_file}" >> "${output_file}"
  echo '</svg>' >> "${output_file}"
}

function main() {
  while IFS= read -r -d '' filename; do
    convert_to_full_svg "${filename}"
  done < <(find csection/ wms/ dali/ resources/ -type f ! -name '*.css' ! -name '*.json' ! -name '.*' -print0 2> /dev/null)

  java -jar "${NU_CHECKER_JAR}" --svg "${TEMP_DIR}"
}

main
