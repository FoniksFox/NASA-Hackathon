package dev.danimania.symbiosis;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class RagService {

    private final InMemoryVectorStore vectorStore;
    private final EmbeddingService embeddingService;
    private final GeminiService geminiService;

    private Map<String, List<String>> topicLinks;

    public RagService(InMemoryVectorStore vectorStore, EmbeddingService embeddingService, GeminiService geminiService) {
        this.vectorStore = vectorStore;
        this.embeddingService = embeddingService;
        this.geminiService = geminiService;
        this.topicLinks = new HashMap<>();

        ObjectMapper mapper = new ObjectMapper();

        try (InputStream is = getClass().getClassLoader().getResourceAsStream("data.json")) {
            if (is == null) {
                throw new RuntimeException("data.json not found in resources");
            }
            topicLinks = mapper.readValue(is,
                    mapper.getTypeFactory().constructMapType(Map.class, String.class, List.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String askTopic(String topic, String question) throws Exception {
        List<String> ids = topicLinks.getOrDefault(topic, List.of());
        String context = ids.stream()
                .map(id -> "https://pmc.ncbi.nlm.nih.gov/articles/PMC" + id + "/")
                .collect(Collectors.joining("\n"));

        String prompt = "You're an expert on " + topic + ". This is your information:\n"
          + context + "\n\nPlease don't go over 40 lines. Include quotes and references to the information (every reference must be linked). Answer to: " + question;


        return geminiService.askGemini(prompt);
    }

    public String findTopic(String question) throws Exception {
        String context = topicLinks.keySet().stream().collect(Collectors.joining(" "));
        String prompt = "Please categorize the following question in the most related topic of the following " + context + ". ONLY ANSWER THE TOPIC NAME, no punctuation or other symbols that do not match that name exactly. The question is: " + question;

        return geminiService.askGemini(prompt);
    }

}
