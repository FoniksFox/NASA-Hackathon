import { Box, Title, Text, Divider, Stack, Badge, Group, ScrollArea } from '@mantine/core';
import { useEffect, useState } from 'react';
import classes from './PublicationViewer.module.css';
import exampleXML from '../assets/11988970.xml?raw';

interface PublicationViewerProps {
  publicationId: string;
}

interface ParsedArticle {
  title: string;
  authors: Array<{ name: string; affiliation?: string }>;
  abstract?: string;
  journal?: string;
  doi?: string;
  pmid?: string;
  publishDate?: string;
  sections: Array<{ title: string; content: string }>;
}

export function PublicationViewer({ publicationId }: PublicationViewerProps) {
  const [article, setArticle] = useState<ParsedArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract PMC ID from publicationId (remove 'pub-' prefix if present)
        const pmcId = publicationId.replace('pub-', '');
        
        // Fetch XML from backend static resources
        // Backend serves files from src/main/resources/static/{pmcId}.xml
        const response = await fetch(`/api/${pmcId}.xml`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch publication: ${response.statusText}`);
        }
        
        const xmlText = await response.text();
        const parsed = parseJATSXML(xmlText);
        setArticle(parsed);
      } catch (err) {
        console.error('Error fetching publication:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [publicationId]);

  if (loading) {
    return (
      <Box className={classes.container}>
        <Text c="dimmed">Loading publication...</Text>
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Box className={classes.container}>
        <Stack gap="md">
          <Text c="red">Error loading publication: {error}</Text>
          <Text size="sm" c="dimmed">
            Publication ID: {publicationId}
          </Text>
          <Text size="sm" c="dimmed">
            Make sure the backend server is running and the article XML file exists in the static resources.
          </Text>
        </Stack>
      </Box>
    );
  }

  return (
    <ScrollArea className={classes.scrollArea}>
      <Box className={classes.container}>
        <Stack gap="lg">
          {/* Title */}
          <Title order={1} className={classes.title}>
            {article.title}
          </Title>

          {/* Metadata */}
          {article.journal && (
            <Group gap="xs">
              <Badge variant="light" size="lg">
                {article.journal}
              </Badge>
              {article.publishDate && (
                <Text size="sm" c="dimmed">
                  {article.publishDate}
                </Text>
              )}
            </Group>
          )}

          {/* Identifiers */}
          {(article.doi || article.pmid) && (
            <Group gap="md">
              {article.doi && (
                <Text size="sm" c="dimmed">
                  DOI: {article.doi}
                </Text>
              )}
              {article.pmid && (
                <Text size="sm" c="dimmed">
                  PMID: {article.pmid}
                </Text>
              )}
            </Group>
          )}

          <Divider />

          {/* Authors */}
          {article.authors.length > 0 && (
            <Box>
              <Title order={4} mb="sm">
                Authors
              </Title>
              <Text size="sm">{article.authors.map((a) => a.name).join(', ')}</Text>
            </Box>
          )}

          {/* Abstract */}
          {article.abstract && (
            <Box>
              <Title order={3} mb="sm">
                Abstract
              </Title>
              <Text className={classes.content}>{article.abstract}</Text>
            </Box>
          )}

          <Divider />

          {/* Sections */}
          {article.sections.map((section, idx) => (
            <Box key={idx}>
              <Title order={3} mb="sm">
                {section.title}
              </Title>
              <Text className={classes.content}>{section.content}</Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </ScrollArea>
  );
}

// Parse JATS XML format (PubMed Central articles)
function parseJATSXML(xmlText: string): ParsedArticle {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');

  // Helper to get text content from element
  const getText = (selector: string, parent: Element | Document = doc): string => {
    const el = parent.querySelector(selector);
    return el?.textContent?.trim() || '';
  };

  // Helper to get all matching elements
  const getAll = (selector: string, parent: Element | Document = doc): Element[] => {
    return Array.from(parent.querySelectorAll(selector));
  };

  // Extract title
  const title = getText('article-title');

  // Extract authors
  const authors = getAll('contrib[contrib-type="author"]').map((contrib) => {
    const surname = getText('surname', contrib);
    const givenNames = getText('given-names', contrib);
    const name = givenNames ? `${givenNames} ${surname}` : surname;
    return { name };
  });

  // Extract abstract
  const abstractEl = doc.querySelector('abstract');
  const abstract = abstractEl?.textContent?.trim() || '';

  // Extract journal info
  const journal = getText('journal-title');

  // Extract DOI and PMID
  const doi = getText('article-id[pub-id-type="doi"]');
  const pmid = getText('article-id[pub-id-type="pmid"]');

  // Extract publish date
  const year = getText('pub-date year');
  const month = getText('pub-date month');
  const day = getText('pub-date day');
  const publishDate = [year, month, day].filter(Boolean).join('-');

  // Extract body sections
  const sections: Array<{ title: string; content: string }> = [];
  const bodySections = getAll('body > sec');

  bodySections.forEach((section) => {
    const sectionTitle = getText('title', section);
    const paragraphs = getAll('p', section);
    const content = paragraphs.map((p) => p.textContent?.trim() || '').join('\n\n');

    if (sectionTitle || content) {
      sections.push({
        title: sectionTitle || 'Section',
        content: content || '',
      });
    }
  });

  return {
    title,
    authors,
    abstract,
    journal,
    doi,
    pmid,
    publishDate,
    sections,
  };
}
