#!/bin/bash
#
dir=$(ls -l .|awk '/^d/ {print $NF}')
softfiles=$(ls $dir)
for i in $softfiles
do
   itt -f $i -p values
done
