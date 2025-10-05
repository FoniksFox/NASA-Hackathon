# ChatView Component

A chat interface component for conversing with an AI assistant about publications, research topics, and graph exploration.

## Features

- **Message History**: Displays conversation with user and AI messages
- **Auto-Scroll**: Automatically scrolls to latest message
- **Typing Indicator**: Shows loading state when AI is responding
- **Workspace Isolation**: Each workspace maintains its own chat history
- **Empty State**: Friendly placeholder when no messages exist
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for newline

## Usage

```tsx
import { ChatView } from './components';

<ChatView
  messages={messages}
  onSendMessage={handleSendMessage}
  isLoading={false}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `Message[]` | Yes | Array of chat messages to display |
| `onSendMessage` | `(message: string) => void` | Yes | Callback when user sends a message |
| `isLoading` | `boolean` | No | Whether AI is currently generating response |

## Message Interface

```typescript
interface Message {
  id: string;           // Unique message identifier
  role: 'user' | 'assistant';  // Who sent the message
  content: string;      // Message text content
  timestamp: Date;      // When message was sent
}
```

## Visual Design

### Message Styling

**User Messages:**
- Aligned to the right
- Mint-colored background (`mint-1` / `zomp-8`)
- Border with mint/zomp accent
- Max width: 70% of container

**AI Messages:**
- Aligned to the left
- Light/dark neutral background
- Border with light/dark accent
- Max width: 70% of container

### Message Header

Each message displays:
- 👤 User icon or 🤖 Robot icon
- Sender name ("You" or "AI Assistant")
- Timestamp (HH:MM format)

### Empty State

When no messages:
- Centered robot icon
- "Start a conversation" message
- Helpful prompt about what to ask

### Loading Indicator

While AI responds:
- Shows assistant message bubble
- Animated mint-colored loader
- "Thinking..." text

## Layout

```
┌─────────────────────────────┐
│     Messages Area           │
│   (ScrollArea - flex: 1)    │
│                             │
│  ┌─────────────────────┐   │
│  │ User Message        │   │
│  └─────────────────────┘   │
│ ┌─────────────────────┐    │
│ │ AI Message          │    │
│ └─────────────────────┘    │
│                             │
├─────────────────────────────┤
│     Input Area (fixed)      │
│  ┌───────────────────────┐ │
│  │ Type message...   [→] │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

## Integration

### With Workspace System

Each workspace maintains its own chat history:

```tsx
const [chatMessages, setChatMessages] = useState<Message[]>(
  activeWorkspace?.chatMessages || []
);

// Update workspace when messages change
updateWorkspaceChatMessages(workspaceId, chatMessages);
```

### Backend Integration

Expected API endpoint:

```
POST /api/chat
```

**Request:**
```json
{
  "message": "Tell me about microgravity research",
  "workspaceId": "workspace-123"
}
```

**Response:**
```json
{
  "response": "Microgravity research involves...",
  "sources": ["pub-1", "pub-2"]
}
```

### Message Handler Example

```tsx
const handleSendMessage = async (message: string) => {
  const userMessage: Message = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content: message,
    timestamp: new Date(),
  };

  setChatMessages(prev => [...prev, userMessage]);
  setIsLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, workspaceId }),
    });
    
    const data = await response.json();
    
    const aiMessage: Message = {
      id: `msg-${Date.now()}-ai`,
      role: 'assistant',
      content: data.response,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, aiMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

## Keyboard Controls

| Key | Action |
|-----|--------|
| Enter | Send message |
| Shift + Enter | New line in message |
| Disabled while loading | Prevents multiple submissions |

## Behavior

### Auto-Scroll
- Automatically scrolls to bottom when new messages arrive
- Smooth scrolling animation
- Uses viewport ref for precise control

### Input Handling
- Clears input after sending
- Disables input while loading
- Trims whitespace from messages
- Won't send empty messages

### Message Display
- Messages stack chronologically
- User messages on right (mint accent)
- AI messages on left (neutral colors)
- Timestamps in local time format
- Pre-wrapped text for proper line breaks

## Styling

Uses `ChatView.module.css` with:
- Full height container with flexbox
- Scrollable messages area
- Fixed input area at bottom
- Light/dark mode support
- Custom message bubble colors

### Color Tokens

- User messages: `mint-1` / `zomp-8`
- AI messages: `light-1` / `dark-6`
- Borders: `light-5` / `dark-5`
- Text: `darker-5` / `light-1`
- Background: `light-4` / `darker-9`

## Accessibility

- Semantic HTML structure
- Form for message input
- Clear role indicators
- Timestamp information
- Loading state feedback

## Future Enhancements

- [ ] Markdown support in messages
- [ ] Code syntax highlighting
- [ ] Publication reference links in messages
- [ ] Copy message content
- [ ] Edit/delete messages
- [ ] Export chat history
- [ ] Message reactions
- [ ] Multi-modal input (voice, images)
- [ ] Suggested questions/prompts
- [ ] Context awareness from open publications
