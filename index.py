import os
import pickle
import webapp2
from google.appengine.ext.webapp import template
#from samplelib import samplemodule




class MainHandler( webapp2.RequestHandler ):

    def get( self ):
        self.response.headers[ 'Content-Type' ] = 'text/html'
        tmpl = os.path.join( os.path.dirname( __file__ ), 'templates/index.html' )
        tmplvars = {

            'title': 'Shining Tweeting Earth'#,
            #'message': samplemodule.sampleMethod( 'A sample message.' )
        }
        self.response.out.write( template.render( tmpl, tmplvars ))


app = webapp2.WSGIApplication( 
        [
            ( '/', MainHandler )
        ], 
        debug=True 
    )