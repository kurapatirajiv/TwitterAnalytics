/**
 * Created by Rajiv on 9/27/16.
 */

import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;
import edu.stanford.nlp.util.CoreMap;
import java.io.*;
import java.util.Properties;

public class SentimentFinder {


    public String findSentiment(String line) {

        Properties props = new Properties();
        props.setProperty("annotators", "tokenize, ssplit, parse, sentiment");
        StanfordCoreNLP pipeline = new StanfordCoreNLP(props);
        String finalSentiment = null;
        if (line != null && line.length() > 0) {
            Annotation annotation = pipeline.process(line);
            for (CoreMap sentence : annotation.get(CoreAnnotations.SentencesAnnotation.class)) {

                finalSentiment = sentence.get(SentimentCoreAnnotations.SentimentClass.class);
            }
        }
        return finalSentiment;
    }

    public static void main(String[] args) throws IOException {


        // All writes are silenced
        System.setErr(new PrintStream(new OutputStream() {
            public void write(int param) {
            }
        }));
        SentimentFinder sentimentAnalyzer = new SentimentFinder();

        FileInputStream fstream = new FileInputStream("src/main/java/StatusText.txt");
        BufferedReader br = new BufferedReader(new InputStreamReader(fstream));

        String tweetStatusLine;
        PrintWriter writer = new PrintWriter("src/main/java/SentimentFile.txt", "UTF-8");
        System.out.println("Sentimental Analysis Started, Silenced the System generated Notifications..");
        while ((tweetStatusLine = br.readLine()) != null) {
            writer.println(sentimentAnalyzer
                    .findSentiment(tweetStatusLine));
        }
        br.close();
        writer.close();
    }
}

