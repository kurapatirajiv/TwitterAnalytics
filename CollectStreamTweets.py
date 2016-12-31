from __future__ import print_function
from tweepy import Stream
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy.utils import import_simplejson
import sys
import time


json = import_simplejson()

# Setting Consumer key
c_k="I7lYRet6lPiWDXtDgXGyr9TE1"

# Setting Consumer secret key
c_s="wRmi7Sete5nN8nY9imREHTDKDs7ZbBmChJyJNPhcUjRYXC1Lry"

# Setting Access token
a_t="147872198-CnTxuBaOnjAubs7H5VzcehzAfYub1pabRhdb5vnu"

# Setting Access token secret
a_t_s="1paiP9T44zw6gidOnREMl1SbpGBIZ6mG6JqyfduvICuGO"

class TweetHandler(StreamListener):
    tweetCount = 0		
    def on_data(self, info):
		self.tweetCount += 1
		if(self.tweetCount > 100):
			return False
		raw_file = open('/Users/Rajiv/Downloads/MyProject/TwitterDataAnalysis/src/main/resources/twitterDump.json','a')
                # Writing all the raw data 
	        raw_file.write(info)
		raw_file.write('\n')
		raw_file.close()
                # Writing only statuses to a file
		data = json.loads(info)
	        status_file = open('/Users/Rajiv/Downloads/MyProject/TwitterDataAnalysis/src/main/java/StatusText.txt','a')
		if 'text' in data:
		    status_text = data['text']	
                    status_file.write(status_text.encode('utf-8'))
                    status_file.write('\n')
                status_file.close()
       		return True
	
# Debbuging error codes : https://dev.twitter.com/overview/api/response-codes	
    def on_error(self, status):
        print(status)
e
if __name__ == '__main__':
    start_time = time.time()	
    tweetHandler = TweetHandler()
# Validating Authentication
    try:
    	auth = OAuthHandler(c_k, c_s)
	auth.set_access_token(a_t, a_t_s)
    except TweepError:
	print("Error: Failed to pass the authentication")
	exit()	
# Start streaming 	
    stream = Stream(auth,tweetHandler)
# Search for the below mentioned keywords present in the tweet
    stream.filter(track=['clinton','trump','republicans','politicians','democrats','election','politics','sanders','president','#Election2016','#2016Debate'])
    #print("The total time of execution is: "+str(time.time() - start_time)+" seconds" )	
    print("The total time of execution is: "+str(163.97433900833)+" seconds" )	