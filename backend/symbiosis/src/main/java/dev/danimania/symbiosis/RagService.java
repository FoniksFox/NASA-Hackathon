package dev.danimania.symbiosis;

import org.springframework.stereotype.Service;

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

        this.topicLinks.put("Molecular Biology", new ArrayList<>());
        this.topicLinks.put("Space Biology", new ArrayList<>());
        this.topicLinks.put("Microgravity", new ArrayList<>());
        this.topicLinks.put("Radiation Biology", new ArrayList<>());
        this.topicLinks.put("Immunology", new ArrayList<>());
        this.topicLinks.put("Genomics", new ArrayList<>());
        this.topicLinks.put("Bioinformatics & Systems Biology", new ArrayList<>());
        this.topicLinks.put("Bone-related Biology", new ArrayList<>());
        this.topicLinks.put("Cardiovascular-related Biology", new ArrayList<>());
        this.topicLinks.put("Microbiology", new ArrayList<>());
        this.topicLinks.put("Astrobiology", new ArrayList<>());
        this.topicLinks.put("Plant Biology & Space Agriculture", new ArrayList<>());
        this.topicLinks.put("Stem Cell & Regenerative Medicine", new ArrayList<>());
        this.topicLinks.put("Oxidative Stress & Aging Biology", new ArrayList<>());
        topicLinks.get("Molecular Biology").add("3630201");
        topicLinks.get("Space Biology").add("4136787");
        topicLinks.get("Microgravity").add("11988870");
        topicLinks.get("Stem Cell & Regenerative Medicine").add("7998608");
    }

    public String askTopic(String topic, String question) throws Exception {
        List<String> ids = topicLinks.getOrDefault(topic, List.of());
        String context = ids.stream()
                .map(id -> "https://pmc.ncbi.nlm.nih.gov/articles/PMC" + id + "/")
                .collect(Collectors.joining("\n"));

        String prompt = "You're an expert on " + topic + ". This is your information:\n"
                + context + "\n\nPlease do any necessary explanations. Include quotes and references to the information. Answer to: " + question;

        return geminiService.askGemini(prompt);
    }

    public String findTopic(String question) throws Exception {
        String context = topicLinks.keySet().stream().collect(Collectors.joining(" "));
        String prompt = "Please categorize the following question in the most related topic of the following " + context + ". ONLY ANSWER THE TOPIC NAME, no punctuation or other symbols that do not match that name exactly. The question is: " + question;

        return geminiService.askGemini(prompt);
    }

}