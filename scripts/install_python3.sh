#!/bin/bash

gcc -v

if [[ $? == 0 ]]
then
    python3 --version

    if [[ $? == 0 ]]
    then
        echo `ifconfig eth0 | grep inet | awk '{print $2}'` installed
    else

        wget -O /root/Python-3.6.5.tgz https://www.python.org/ftp/python/3.6.5/Python-3.6.5.tgz

        tar zxvf /root/Python-3.6.5.tgz -C /root/ && cd /root/Python-3.6.5

        ./configure --prefix=/usr/local/python3.6

        make && make install

        if [[ $? == 0 ]]
        then 

            echo "export PATH=\$PATH:/usr/local/python3.6/bin" >> /root/.bashrc
            source /root/.bashrc

            echo `ifconfig eth0 | grep inet | awk '{print $2}'` success
        else
            echo `ifconfig eth0 | grep inet | awk '{print $2}'` makeFailed
        fi
    fi
else
    echo `ifconfig eth0 | grep inet | awk '{print $2}'` needGcc
fi
