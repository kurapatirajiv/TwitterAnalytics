package MyProject.MRJobs.Scala

import java.lang.System._
import org.apache.spark.sql.SQLContext
import org.apache.spark.{SparkContext, SparkConf}


/**
 * Created by Rajiv on 10/12/2016.
 */
object ScalaQueries {
  def main(args: Array[String]) {

    println("Twitter big data analysis")
    setProperty("hadoop.home.dir", "/Users/hadoop/hadoop")

    val conf = new SparkConf().setAppName("SparkSQL").setMaster("local")

    val sc = new SparkContext(conf)

    val sqlContext = new SQLContext(sc)

    // mapping and reducing the country names into output file

    val textFile = sc.textFile("src/main/java/SentimentFile.txt")

    val sentimentStats = textFile.flatMap(line => line.split("\n"))
      .map(word => (word, 1))
      .reduceByKey(_ + _)

    sentimentStats.saveAsTextFile("src/main/resources/SentimentalAnalysis")

    // Read the Tweets JSON file

    val tweetFile = sqlContext.read.json("src/main/resources/twitterDump.json")

    // The schema is printed using the below statement

    tweetFile.printSchema();

    // Loading the tweets into a table

    tweetFile.registerTempTable("TempTweetTable")
    val countryCounts = sqlContext.sql("SELECT place.country_code, place.country,count(*) as country_count from TempTweetTable where place.country!='null' GROUP BY place.country,place.country_code ORDER BY country_count DESC LIMIT 25")

    // Listing of Countries along with their tweet count

    countryCounts.map(x => (x(0), x(1), x(2))).coalesce(1, true).saveAsTextFile("src/main/resources/Query1-Country")

    // Retrieving the popular hash tag used

    val popularHashTag = sqlContext.sql("SELECT lower(entities.hashtags.text[0]), count(*) as count FROM TempTweetTable WHERE entities.hashtags.text[1] IS NOT NULL group by lower(entities.hashtags.text[0]) order by count desc LIMIT 60")

    popularHashTag.map(x => (x(0), x(1))).saveAsTextFile("src/main/resources/Query2-Hashtag")


    // Retrieving the time period during which the tweet is extracted

    val timePeriod = sqlContext.sql("select substring(created_at, 12,2), count(*) as count from TempTweetTable where created_at is not null " +
      "group by substring(created_at, 12,2) ORDER BY count DESC ")

    //map and reduce the results into a file

    timePeriod.map(x => (x(0), x(1))).coalesce(1, true).saveAsTextFile("src/main/resources/Query3-Hour")

    // Retrieving popular users based on tweet count

    val popularUsers = sqlContext.sql("select user.screen_name as username,count(*) as usercount from TempTweetTable GROUP BY user.screen_name ORDER BY usercount DESC LIMIT 15")

    popularUsers.registerTempTable("popularUsers")

    // Retrieve users with high follower count

    val followerCount = sqlContext.sql("SELECT user.followers_count as follow,user.screen_name as username,count(*) as followc from TempTweetTable GROUP BY user.followers_count,user.screen_name ORDER BY followc DESC LIMIT 45")

    followerCount.registerTempTable("followerCount")

    // Joining popular and high follower Count users

    val topUsers = sqlContext.sql("select popularUsers.username,followerCount.follow from popularUsers join followerCount on (popularUsers.username = followerCount.username) GROUP BY popularUsers.username,followerCount.follow ORDER BY followerCount.follow DESC")

    topUsers.map(x => (x(0), x(1))).coalesce(1, true).saveAsTextFile("src/main/resources/Query4-Popularusers")

    // Retrieving Sensitivity of a tweet

    val sensitivity = sqlContext.sql("select possibly_sensitive, count(*) from TempTweetTable where possibly_sensitive is not null group by possibly_sensitive")

    sensitivity.map(x => (x(0), x(1))).coalesce(1, true).saveAsTextFile("src/main/resources/Query5-Sensitivity")

    //getting how popular the leaders are among the public

    val leadersList = sqlContext.sql("select a.text as Text, count(*) as count from (select case when text like '%clinton%' then 'clinton' when text like '%trump%' then 'trump' when text like '%cruz%' then 'cruz' when text like '%sanders%' then 'sanders' end as text from  TempTweetTable)a where a.text is not null group by a.text")

    leadersList.map(x => (x(0), x(1))).coalesce(1, true).saveAsTextFile("src/main/resources/Query6-Leaders")

    //Getting the time Zone, the time zone is trimmed till first 13 characters for attaining readability on UI page

    val timeZones = sqlContext.sql("select substring(user.time_zone, 0,13) as timezone,count(*)as count from TempTweetTable where user.time_zone is not null GROUP BY user.time_zone ORDER BY count DESC LIMIT 11")

    timeZones.map(x => (x(0), x(1))).coalesce(1, true).saveAsTextFile("src/main/resources/Query7-Timezone")

  }
}
