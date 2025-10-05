package dev.danimania.symbiosis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/umap")
public class UmapController {

    private final UmapService umapService;

    public UmapController(UmapService umapService) {
        this.umapService = umapService;
    }

    @GetMapping("/coords/{id}")
    public ResponseEntity<?> getCoords(@PathVariable String id) {
        ArticleCoords coords = umapService.getArticleCoords(id);
        if (coords == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(coords);
    }

}
