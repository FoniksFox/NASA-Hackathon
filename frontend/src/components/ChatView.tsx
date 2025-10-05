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

  return (
    <Box className={`${classes.container} ${currentTopic ? classes.containerWithTopic : ''}`}>
      {/* Topic Header */}
      {currentTopic && (
        <Box className={classes.topicHeader}>
          <Group gap="xs" justify="center">
            <IconBrain size={18} />
            <Text size="sm" fw={500}>
              Specialist:
            </Text>
            <Badge
              variant="light"
              color="mint"
              size="lg"
              className={classes.topicBadge}
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
                >
                  <Box className={classes.messageHeader}>
                    {message.role === 'user' ? (
                      <IconUser size={16} />
                    ) : (
                      <IconRobot size={16} />
                    )}
                    <Text size="xs" c="dimmed" ml={4}>
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </Text>
                    {message.topic && message.role === 'assistant' && (
                      <Badge size="xs" variant="dot" color="mint" ml={4}>
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
