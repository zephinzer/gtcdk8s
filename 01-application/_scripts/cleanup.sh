#!/bin/sh
CURR_DIR=$(dirname $0);
rm -rf ${CURR_DIR}/../data/alertmanager/*;
rm -rf ${CURR_DIR}/../data/elasticsearch/*;
rm -rf ${CURR_DIR}/../data/grafana/*;
rm -rf ${CURR_DIR}/../data/prometheus/*;