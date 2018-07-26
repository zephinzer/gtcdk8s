#!/bin/sh
DOCKER_PS="$(docker ps | grep '01-application')";
UP="\033[32mUP\033[0m\n";
DOWN="\033[31mDOWN\033[0m\n";
_=$(printf -- "${DOCKER_PS}" | grep 'application_1' >/dev/null);
printf -- 'application 1: ';
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
_=$(printf -- "${DOCKER_PS}" | grep 'application_2' >/dev/null);
printf -- 'application 2: ';
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
printf -- 'application 3: ';
_=$(printf -- "${DOCKER_PS}" | grep 'application_3' >/dev/null);
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
printf -- 'alertmanager : ';
_=$(printf -- "${DOCKER_PS}" | grep 'alerts' >/dev/null);
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
printf -- 'elasticsearch: ';
_=$(printf -- "${DOCKER_PS}" | grep 'logs_db' >/dev/null);
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
printf -- 'fluentd      : ';
_=$(printf -- "${DOCKER_PS}" | grep 'collator' >/dev/null);
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
printf -- 'grafana      : ';
_=$(printf -- "${DOCKER_PS}" | grep 'dashboard' >/dev/null);
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
printf -- 'kibana       : ';
_=$(printf -- "${DOCKER_PS}" | grep 'logs_view' >/dev/null);
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
printf -- 'prometheus   : ';
_=$(printf -- "${DOCKER_PS}" | grep 'metrics' >/dev/null);
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
printf -- 'notifier     : ';
_=$(printf -- "${DOCKER_PS}" | grep 'notifier' >/dev/null);
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
printf -- 'zipkin       : ';
_=$(printf -- "${DOCKER_PS}" | grep 'tracing' >/dev/null);
[ "$?" = "0" ] && printf "${UP}" || printf "${DOWN}";
# if [ -z $(printf -- "${DOCKER_PS}" | grep 'application_1') ]; then
#   printf -- 'UP\n';
# else
#   printf -- '${DOWN}';
# fi;