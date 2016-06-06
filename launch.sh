#!/bin/bash
# My first script

echo "Starting Server"
cd floorplan
rails s -p $PORT -b $IP
