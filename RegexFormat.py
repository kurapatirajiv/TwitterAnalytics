# This Program Replaces parenthesis and adds the necessary header needed for the UI 

import re

# Adding Country code, Country Name, Tweet Density to the Data 

Country_raw = open('/Users/Rajiv/Downloads/MyProject/TwitterDataAnalysis/src/main/resources/Query1-Country/part-00000','r')
Country = open('UI/Country.csv','w')
Country.write("Country Code,Country Name,Tweet Density\n")
for data in Country_raw:
        modData = re.sub('[()]','',data)
	Country.write(modData)

# Reformatting HashTags values 

hashTags_raw = open('/Users/Rajiv/Downloads/MyProject/TwitterDataAnalysis/src/main/resources/Query2-Hashtag/part-00000','r')
hashTags = open('UI/hashtags.txt','w')
hashTags.write("text,size\n")
for data in hashTags_raw:
        modData = re.sub('[()]','',data)
	hashTags.write(modData)

# Reformatting Senstivity values 

Sensitivity_raw = open('/Users/Rajiv/Downloads/MyProject/TwitterDataAnalysis/src/main/resources/Query5-Sensitivity/part-00000','r')
Sensitivity = open('UI/Sensitivity.txt','w')
Sensitivity.write("key,value\n")
for data in Sensitivity_raw:
        modData = re.sub('[()]','',data)
	Sensitivity.write(modData) 

# Reformatting Popular Leader values 

Leaders_raw = open('/Users/Rajiv/Downloads/MyProject/TwitterDataAnalysis/src/main/resources/Query6-Leaders/part-00000','r')
Leaders = open('UI/Leaders.txt','w')
Leaders.write("key,value\n")
for data in Leaders_raw:
        modData = re.sub('[()]','',data)
	Leaders.write(modData)

# Reformatting Timezone values 

TimeZone_raw = open('/Users/Rajiv/Downloads/MyProject/TwitterDataAnalysis/src/main/resources/Query7-Timezone/part-00000','r')
TimeZone = open('UI/TimeZone.txt','w')
TimeZone.write("name,value\n")
for data in TimeZone_raw:
        modData = re.sub('[()]','',data)
	TimeZone.write(modData)

