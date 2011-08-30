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
from util.sessions import Session

class HomePage(webapp.RequestHandler):
    def get(self):
        logging.info("reached home page")
        '''path=self.request.path'''
        '''temp=os.path.join(os.path.dirname(__file__),'templates/index.html')'''
        '''html=template.render(temp,{'path':path})'''
        '''self.response.out.write(html)'''
        self.redirect("/map")

class LogoutHandler(webapp.RequestHandler):
    def get(self):
        self.session=Session()
        self.session.delete_item('username')
        self.session.delete_item('ft_client')
        path=self.request.path
        temp=os.path.join(os.path.dirname(__file__),'templates/index.html')
        html=template.render(temp,{'path':path})
        self.response.out.write(html)

class HousePage(webapp.RequestHandler):

    def get(self):
        path=self.request.path
        self.session=Session()
        temp=os.path.join(os.path.dirname(__file__),'templates/Apartment.html')
        html=template.render(temp,{'path':path,'username':self.session.get('username')})
        self.response.out.write(html)

    def post(self):
        import sys, getpass
        self.session=Session()
        ft_client=self.session.get('ft_client')
        if ft_client is not None:
            results = ft_client.query(SQL().showTables())
            address = self.request.get('address')
            rent = self.request.get('rent')
            bedrooms = self.request.get('bedrooms')
            rating = self.request.get('rating')
            review = self.request.get('review')
            rowid = (ft_client.query(SQL().insert(1269105, {'ADDRESS':str(address), 'Rent': str(rent), 'Bedrooms': str(bedrooms),'Rating': str(rating),'Review': str(review)})))
            self.redirect("/map")

class AuthenticationPage(webapp.RequestHandler):

    def get(self):
        logging.info("reached login page")
        path=self.request.path
        temp=os.path.join(os.path.dirname(__file__),'templates/login.html')
        html=template.render(temp,{})
        self.response.out.write(html)

    def post(self):
        import sys, getpass
        self.session=Session()
        username = self.request.get('username')
        password = self.request.get('password')
        self.session.delete_item('username')

        if username=='' or password=='':
            temp=os.path.join(os.path.dirname(__file__),'templates/login.html')
            html=template.render(temp,{'error':'Invalid Login'})
            self.response.out.write(html)
        else:
            token = ClientLogin().authorize(username, password)
            if token is not None:
                self.session['username']=username
                ft_client = ftclient.ClientLoginFTClient(token)
                self.session['ft_client']=ft_client
                results = ft_client.query(SQL().showTables())
                temp=os.path.join(os.path.dirname(__file__),'templates/index.html')
                html=template.render(temp,{'username':username})
                self.redirect("/house")
            else:
                logging.info("unable to login")
                temp=os.path.join(os.path.dirname(__file__),'templates/login.html')
                html=template.render(temp,{'error':'Invalid Login'})
                self.response.out.write(html)







        #show tables


        '''temp=os.path.join(os.path.dirname(__file__),'templates/index.html')
        html=template.render(temp,{})
        html=html+results
        self.response.out.write(html)'''

class MapPage(webapp.RequestHandler):
    def get(self):
        self.session=Session()
        path=self.request.path
        temp=os.path.join(os.path.dirname(__file__),'templates/map.html')
        html=template.render(temp,{'path':path,'username':self.session.get('username')})
        self.response.out.write(html)
    def post(self):
        import sys, getpass
        self.session=Session()
        ft_client=self.session.get('ft_client')
        if ft_client is not None:

            '''rent = self.request.get('rent')'''
            bedrooms = self.request.get('bedrooms')
            rating = self.request.get('rating')

            rowid = (ft_client.query(SQL().insert(1269105, {'ADDRESS':str(address), 'Rent': str(rent), 'Bedrooms': str(bedrooms),'Rating': str(rating),'Review': str(review)})))
            '''self.response.out.write(str(rowid))'''
            self.redirect("/map")


def main():

    app=webapp.WSGIApplication([('/house',HousePage),('/login', AuthenticationPage),('/logout', LogoutHandler),('/map', MapPage),('/.*',HomePage)],debug=True)
    wsgiref.handlers.CGIHandler().run(app)

if __name__ == '__main__':
    main()
