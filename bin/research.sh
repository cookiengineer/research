#!/bin/bash

PROJECT_ROOT=$(cd "$(dirname "$0")/../"; pwd);
LYCHEEJS_ROOT="/opt/lycheejs";
LYCHEEJS_FERTILIZER=`which lycheejs-fertilizer`;
LYCHEEJS_HELPER=`which lycheejs-helper`;


# XXX: Allow /tmp/lycheejs usage
if [ "$(basename $PWD)" == "lycheejs" ] && [ "$PWD" != "$LYCHEEJS_ROOT" ]; then
	LYCHEEJS_ROOT="$PWD";
	LYCHEEJS_FERTILIZER="$PWD/libraries/fertilizer/bin/fertilizer.sh";
	LYCHEEJS_HELPER="$PWD/bin/helper.sh";
fi;


if [ "$LYCHEEJS_HELPER" != "" ] && [ "$LYCHEEJS_FERTILIZER" != "" ]; then

	cd $PROJECT_ROOT;
	nw .;

	exit $?;

else

	exit 1;

fi;

