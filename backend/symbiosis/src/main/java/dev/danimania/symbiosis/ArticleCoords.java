package dev.danimania.symbiosis;

public class ArticleCoords {
    public String id;
    public String title;
    public double x;
    public double y;
    public double z;

    public ArticleCoords() {}

    public ArticleCoords(String id, String title, double x, double y, double z) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
