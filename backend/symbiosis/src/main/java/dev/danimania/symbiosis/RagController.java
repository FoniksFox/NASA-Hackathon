package dev.danimania.symbiosis;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/rag")
public class RagController {

    private final RagService ragService;
    private final InMemoryVectorStore vectorStore;
    private final EmbeddingService embeddingService;

    public RagController(RagService ragService, InMemoryVectorStore vectorStore, EmbeddingService embeddingService) {
        this.ragService = ragService;
        this.vectorStore = vectorStore;
        this.embeddingService = embeddingService;
    }

    @PostMapping("/add")
    public String addChunk(@RequestBody Map<String, String> payload) {
        String id = payload.getOrDefault("id", UUID.randomUUID().toString());
        String text = payload.get("text");
        vectorStore.addChunk(new TextChunk(id, text, embeddingService.embed(text)));
        return "Added chunk: " + id;
    }

    @PostMapping("/ask-topic")
    public String askTopic(@RequestBody Map<String, String> payload) throws Exception {
        String topic = payload.get("topic");
        String question = payload.get("question");
        return ragService.askTopic(topic, question);
    }

    @PostMapping("/find-topic")
    public String findTopic(@RequestBody String question) throws Exception {
        return ragService.findTopic(question);
    }
}
