package dev.danimania.symbiosis;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmbeddingService {

    // Dummy deterministic embedding for demo
    public List<Double> embed(String text) {
        Random rand = new Random(text.hashCode());
        List<Double> vec = new ArrayList<>();
        for (int i = 0; i < 128; i++) vec.add(rand.nextDouble());
        return vec;
    }
}