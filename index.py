#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      apurvag
#
# Created:     11/07/2011
# Copyright:   (c) apurvag 2011
# Licence:     <your licence>
#-------------------------------------------------------------------------------
#!/usr/bin/env python

import wsgiref.handlers

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
import os
from authorization.clientlogin import ClientLogin
from sql.sqlbuilder import SQL
import ftclient
from fileimport.fileimporter import CSVImporter
import logging


class HomePage(webapp.RequestHandler):
    def get(self):
        logging.info("reached home page")
        path=self.request.path
        temp=os.path.join(os.path.dirname(__file__),'templates/index.html')
        html=template.render(temp,{'path':path})
        self.response.out.write(html)

class AuthenticationPage(webapp.RequestHandler):
    def get(self):
        logging.info("reached login page")
        path=self.request.path
        temp=os.path.join(os.path.dirname(__file__),'templates/login.html')
        html=template.render(temp,{})
        self.response.out.write(html)

    def post(self):
        import sys, getpass
        username = self.request.get('username')
        password = self.request.get('password')
        token = ClientLogin().authorize(username, password)
        ft_client = ftclient.ClientLoginFTClient(token)
        #show tables
        '''path=self.request.path
        results = ft_client.query(SQL().showTables())
        temp=os.path.join(os.path.dirname(__file__),'templates/index.html')
        html=template.render(temp,{})
        html=html+results
        self.response.out.write(html)'''

class MapPage(webapp.RequestHandler):
    def get(self):
        path=self.request.path
        temp=os.path.join(os.path.dirname(__file__),'templates/map.html')
        html=template.render(temp,{'path':path})
        self.response.out.write(html)

def main():

    app=webapp.WSGIApplication([('/index', HomePage),('/map', MapPage),('/login', AuthenticationPage),('/.*', HomePage)],debug=True)
    wsgiref.handlers.CGIHandler().run(app)

if __name__ == '__main__':
    main()
