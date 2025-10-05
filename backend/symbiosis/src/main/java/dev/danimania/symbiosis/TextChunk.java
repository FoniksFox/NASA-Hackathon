package dev.danimania.symbiosis;

import java.util.List;

public class TextChunk {
    public final String id;
    public final String text;
    public final List<Double> embedding;

    public TextChunk(String id, String text, List<Double> embedding) {
        this.id = id;
        this.text = text;
        this.embedding = embedding;
    }
}
