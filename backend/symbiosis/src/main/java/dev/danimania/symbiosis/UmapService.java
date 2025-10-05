package dev.danimania.symbiosis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UmapService {

    private Map<String, ArticleCoords> articleMap = new HashMap<>();

    public UmapService() {
        loadMap();
    }

    public void loadMap() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getResourceAsStream("/umap.json");
            List<ArticleCoords> articles = mapper.readValue(is, new TypeReference<List<ArticleCoords>>() {});
            for (ArticleCoords a : articles) {
                articleMap.put(a.id, a);
            }
            System.out.println("Loaded " + articleMap.size() + " articles into memory.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ArticleCoords getArticleCoords(String id) {
        return articleMap.get(id);
    }

    public Collection<ArticleCoords> getAllArticles() {
        return articleMap.values();
    }
}
