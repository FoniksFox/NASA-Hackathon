import { useState, useRef, useEffect } from 'react';
import { Box, TextInput, ActionIcon, ScrollArea, Text, Stack, Paper, Loader, Badge, Group } from '@mantine/core';
import { IconSend, IconRobot, IconUser, IconBrain } from '@tabler/icons-react';
import classes from './ChatView.module.css';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  topic?: string; // The specialist/topic handling this message
}

// Topic color palette mapping
const TOPIC_COLORS: Record<string, string> = {
  // Palette 1: #D65C72 - Biology & Medicine
  "Radiation Biology": "#D65C72",
  "Bone-related Biology": "#D65C72",
  "Cardiovascular-related Biology": "#D65C72",
  "Immunology": "#D65C72",
  "Microbiology": "#D65C72",
  
  // Palette 2: #5465A2 - Space Sciences
  "Space Biology": "#5465A2",
  "Microgravity": "#5465A2",
  "Astrobiology": "#5465A2",
  "Space Medicine": "#5465A2",
  "Plant Biology & Space Agriculture": "#5465A2",
  
  // Palette 3: #BC9E62 - Molecular Sciences
  "Molecular Biology": "#BC9E62",
  "Genomics": "#BC9E62",
  "Bioinformatics & Systems Biology": "#BC9E62",
  "Stem Cell & Regenerative Medicine": "#BC9E62",
  "Oxidative Stress & Aging Biology": "#BC9E62",
};

// Get color for a topic, default to mint if not found
function getTopicColor(topic?: string): string {
  if (!topic) return '#4db391'; // Default mint color
  return TOPIC_COLORS[topic] || '#4db391';
}

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  currentTopic?: string; // Current active specialist/topic
}

export function ChatView({ messages, onSendMessage, isLoading = false, currentTopic }: ChatViewProps) {
  const [input, setInput] = useState('');
  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const topicColor = getTopicColor(currentTopic);

  return (
    <Box 
      className={classes.container}
      style={currentTopic ? { border: `3px solid ${topicColor}` } : undefined}
    >
      {/* Topic Header */}
      {currentTopic && (
        <Box className={classes.topicHeader} style={{ borderBottomColor: topicColor }}>
          <Group gap="xs" justify="center">
            <IconBrain size={18} style={{ color: topicColor }} />
            <Text size="sm" fw={500}>
              Specialist:
            </Text>
            <Badge
              variant="light"
              size="lg"
              className={classes.topicBadge}
              style={{ 
                backgroundColor: `${topicColor}20`,
                color: topicColor,
                borderColor: topicColor
              }}
            >
              {currentTopic}
            </Badge>
          </Group>
        </Box>
      )}

      {/* Messages Area */}
      <ScrollArea className={classes.messagesArea} viewportRef={viewportRef}>
        <Stack gap="md" p="md">
          {messages.length === 0 ? (
            <Box className={classes.emptyState}>
              <IconRobot size={48} stroke={1.5} opacity={0.3} />
              <Text c="dimmed" size="sm" mt="md">
                Start a conversation with the AI assistant
              </Text>
              <Text c="dimmed" size="xs" mt="xs">
                Ask about publications, research topics, or get help exploring the graph
              </Text>
            </Box>
          ) : (
            messages.map((message) => (
              <Box
                key={message.id}
                className={
                  message.role === 'user'
                    ? classes.messageContainerUser
                    : classes.messageContainerAssistant
                }
              >
                <Paper
                  className={
                    message.role === 'user' ? classes.messageUser : classes.messageAssistant
                  }
                  p="sm"
                  style={
                    message.role === 'assistant' && message.topic
                      ? { 
                          borderLeft: `4px solid ${getTopicColor(message.topic)}`,
                          boxShadow: `0 0 0 1px ${getTopicColor(message.topic)}40`
                        }
                      : undefined
                  }
                >
                  <Box className={classes.messageHeader}>
                    {message.role === 'user' ? (
                      <IconUser size={16} />
                    ) : (
                      <IconRobot size={16} style={{ color: message.topic ? getTopicColor(message.topic) : undefined }} />
                    )}
                    <Text size="xs" c="dimmed" ml={4}>
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </Text>
                    {message.topic && message.role === 'assistant' && (
                      <Badge 
                        size="xs" 
                        variant="dot" 
                        ml={4}
                        style={{ 
                          backgroundColor: `${getTopicColor(message.topic)}20`,
                          color: getTopicColor(message.topic),
                          borderColor: getTopicColor(message.topic)
                        }}
                      >
                        {message.topic}
                      </Badge>
                    )}
                    <Text size="xs" c="dimmed" ml="auto">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </Box>
                  <Text size="sm" className={classes.messageContent}>
                    {message.content}
                  </Text>
                </Paper>
              </Box>
            ))
          )}
          {isLoading && (
            <Box className={classes.messageContainerAssistant}>
              <Paper className={classes.messageAssistant} p="sm">
                <Box className={classes.messageHeader}>
                  <IconRobot size={16} />
                  <Text size="xs" c="dimmed" ml={4}>
                    AI Assistant
                  </Text>
                </Box>
                <Box className={classes.loadingIndicator}>
                  <Loader size="xs" color="mint" />
                  <Text size="sm" c="dimmed" ml="xs">
                    Thinking...
                  </Text>
                </Box>
              </Paper>
            </Box>
          )}
        </Stack>
      </ScrollArea>

      {/* Input Area */}
      <Box className={classes.inputArea}>
        <form onSubmit={handleSubmit} className={classes.inputForm}>
          <TextInput
            className={classes.input}
            placeholder="Ask me anything about the publications..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            rightSection={
              <ActionIcon
                type="submit"
                variant="filled"
                color="mint"
                disabled={!input.trim() || isLoading}
                size="lg"
              >
                <IconSend size={18} />
              </ActionIcon>
            }
            rightSectionWidth={50}
          />
        </form>
      </Box>
    </Box>
  );
}
