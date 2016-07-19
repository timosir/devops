#!/usr/bin/env python
# -*- coding: utf-8 -*-

from    flask.ext.mysql import MySQL
mysql = MySQL()
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'devops'
app.config['MYSQL_DATABASE_PASSWORD'] = 'Smm_devops'
app.config['MYSQL_DATABASE_DB'] = 'deploy'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

