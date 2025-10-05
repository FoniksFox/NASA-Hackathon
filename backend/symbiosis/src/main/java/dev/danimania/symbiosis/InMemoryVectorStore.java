package dev.danimania.symbiosis;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InMemoryVectorStore {

    private final List<TextChunk> chunks = new ArrayList<>();

    public void addChunk(TextChunk chunk) {
        chunks.add(chunk);
    }

    public List<TextChunk> query(List<Double> queryEmbedding, int topK) {
        return chunks.stream()
                .sorted((a, b) -> Double.compare(
                        VectorUtils.cosineSimilarity(queryEmbedding, b.embedding),
                        VectorUtils.cosineSimilarity(queryEmbedding, a.embedding)
                ))
                .limit(topK)
                .toList();
    }

    public List<TextChunk> getAllChunks() {
        return chunks;
    }
}