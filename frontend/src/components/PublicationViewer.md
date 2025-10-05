# PublicationViewer Component

A React component for displaying scientific publications in JATS XML format (PubMed Central articles).

## Features

- **Automatic XML Parsing**: Parses JATS XML format used by PubMed Central
- **Clean Typography**: Displays articles with clear hierarchy and formatting
- **Metadata Display**: Shows title, authors, journal, DOI, PMID, and publication date
- **Section Navigation**: Organizes content into sections with proper headings
- **Responsive Layout**: Scrollable content with maximum width for readability

## Usage

```tsx
import { PublicationViewer } from './components';

<PublicationViewer publicationId="pub-12345" />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `publicationId` | `string` | Yes | Unique identifier for the publication to fetch |

## XML Structure Support

The component parses JATS XML with the following elements:

### Metadata
- `article-title`: Main article title
- `journal-title`: Journal name
- `article-id[pub-id-type="doi"]`: Digital Object Identifier
- `article-id[pub-id-type="pmid"]`: PubMed ID
- `pub-date`: Publication date (year-month-day)

### Authors
- `contrib[contrib-type="author"]`: Author entries
  - `given-names`: First/middle names
  - `surname`: Last name

### Content
- `abstract`: Article abstract
- `body > sec`: Body sections
  - `title`: Section heading
  - `p`: Paragraphs

## Backend Integration

The component expects a backend API endpoint:

```
GET /api/publications/:publicationId
```

This should return the raw JATS XML text for the requested publication.

### Example Backend Response

```xml
<?xml version="1.0"?>
<pmc-articleset>
  <article>
    <front>
      <article-meta>
        <article-id pub-id-type="pmid">12345678</article-id>
        <article-id pub-id-type="doi">10.1234/example</article-id>
        <title-group>
          <article-title>Example Article Title</article-title>
        </title-group>
        <contrib-group>
          <contrib contrib-type="author">
            <name>
              <surname>Smith</surname>
              <given-names>John</given-names>
            </name>
          </contrib>
        </contrib-group>
        <abstract>
          <p>Article abstract text...</p>
        </abstract>
      </article-meta>
    </front>
    <body>
      <sec>
        <title>Introduction</title>
        <p>Section content...</p>
      </sec>
    </body>
  </article>
</pmc-articleset>
```

## Styling

The component uses Mantine's theming system with custom CSS modules:

- `.scrollArea`: Full-height scrollable container
- `.container`: Content wrapper with max-width and padding
- `.title`: Article title styling
- `.content`: Body text formatting with proper line-height

Colors automatically adapt to light/dark mode using Mantine's `light-dark()` function.

## Future Enhancements

- [ ] Support for figures and tables
- [ ] Citation links and references section
- [ ] Math equation rendering (MathML support)
- [ ] Export to different formats
- [ ] Highlighting and annotations
- [ ] Search within article
- [ ] Related articles sidebar
