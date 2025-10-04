import { useState } from 'react';
import { 
  Box, 
  Stack, 
  UnstyledButton, 
  Text, 
  ActionIcon, 
  Tooltip,
  TextInput,
  Modal,
  Button,
  Group,
  ColorSwatch
} from '@mantine/core';
import { IconPlus, IconTrash, IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import classes from './Sidebar.module.css';

export interface Workspace {
  id: string;
  name: string;
  color?: string;
}

interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSwitchWorkspace: (workspaceId: string) => void;
  onCreateWorkspace: (name: string, color?: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onRenameWorkspace: (workspaceId: string, newName: string) => void;
}

const WORKSPACE_COLORS = [
  'blue', 'red', 'green', 'yellow', 'cyan', 'pink', 'grape', 'violet', 'indigo', 'teal'
];

export default function Sidebar({
  workspaces,
  activeWorkspaceId,
  onSwitchWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
  onRenameWorkspace,
}: SidebarProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      onCreateWorkspace(newWorkspaceName.trim(), selectedColor);
      setNewWorkspaceName('');
      setSelectedColor('blue');
      setCreateModalOpen(false);
    }
  };

  const handleStartEdit = (workspace: Workspace) => {
    setEditingWorkspaceId(workspace.id);
    setEditingName(workspace.name);
  };

  const handleSaveEdit = () => {
    if (editingWorkspaceId && editingName.trim()) {
      onRenameWorkspace(editingWorkspaceId, editingName.trim());
      setEditingWorkspaceId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingWorkspaceId(null);
    setEditingName('');
  };

  return (
    <>
      <Box className={classes.sidebar}>
        {/* Workspace List Section */}
        <Box className={classes.workspaceSection}>
          <Stack gap="xs" p="xs">
            {/* Workspace List */}
            {workspaces.map((workspace) => (
            <Box
              key={workspace.id}
              className={`${classes.workspaceItem} ${
                activeWorkspaceId === workspace.id ? classes.workspaceItemActive : ''
              }`}
            >
              {editingWorkspaceId === workspace.id ? (
                <Group gap="xs" style={{ flex: 1 }}>
                  <TextInput
                    value={editingName}
                    onChange={(e) => setEditingName(e.currentTarget.value)}
                    size="xs"
                    style={{ flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                  />
                  <ActionIcon size="xs" onClick={handleSaveEdit} color="green">
                    <IconCheck size={14} />
                  </ActionIcon>
                  <ActionIcon size="xs" onClick={handleCancelEdit} color="red">
                    <IconX size={14} />
                  </ActionIcon>
                </Group>
              ) : (
                <>
                  <UnstyledButton
                    onClick={() => onSwitchWorkspace(workspace.id)}
                    className={classes.workspaceButton}
                  >
                    <Group gap="xs">
                      <ColorSwatch color={`var(--mantine-color-${workspace.color || 'blue'}-6)`} size={8} />
                      <Text size="sm" lineClamp={1}>
                        {workspace.name}
                      </Text>
                    </Group>
                  </UnstyledButton>
                  
                  {activeWorkspaceId === workspace.id && (
                    <Group gap={4} className={classes.workspaceActions}>
                      <Tooltip label="Rename" position="right">
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={() => handleStartEdit(workspace)}
                        >
                          <IconPencil size={12} />
                        </ActionIcon>
                      </Tooltip>
                      {workspaces.length > 1 && (
                        <Tooltip label="Delete" position="right">
                          <ActionIcon
                            size="xs"
                            variant="subtle"
                            color="red"
                            onClick={() => onDeleteWorkspace(workspace.id)}
                          >
                            <IconTrash size={12} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                  )}
                </>
              )}
            </Box>
          ))}

            {/* Create New Workspace Button */}
            <Tooltip label="New Workspace" position="right">
              <UnstyledButton
                onClick={() => setCreateModalOpen(true)}
                className={classes.createButton}
              >
                <Group gap="xs">
                  <IconPlus size={16} />
                  <Text size="sm">New</Text>
                </Group>
              </UnstyledButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* UMAP Visualization Section */}
        <Box className={classes.umapSection}>
          <Text size="xs" fw={600} mb="xs" px="xs" c="dimmed">
            GRAPH PREVIEW
          </Text>
          <Box className={classes.umapPlaceholder}>
            <Stack align="center" justify="center" h="100%" gap="xs">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="15" cy="15" r="4" fill="var(--mantine-color-blue-6)" opacity="0.6" />
                <circle cx="45" cy="20" r="3" fill="var(--mantine-color-green-6)" opacity="0.6" />
                <circle cx="30" cy="35" r="5" fill="var(--mantine-color-red-6)" opacity="0.6" />
                <circle cx="20" cy="45" r="3" fill="var(--mantine-color-yellow-6)" opacity="0.6" />
                <circle cx="40" cy="40" r="4" fill="var(--mantine-color-cyan-6)" opacity="0.6" />
                <line x1="15" y1="15" x2="30" y2="35" stroke="var(--mantine-color-gray-5)" strokeWidth="1" opacity="0.3" />
                <line x1="30" y1="35" x2="40" y2="40" stroke="var(--mantine-color-gray-5)" strokeWidth="1" opacity="0.3" />
                <line x1="30" y1="35" x2="20" y2="45" stroke="var(--mantine-color-gray-5)" strokeWidth="1" opacity="0.3" />
              </svg>
              <Text size="xs" c="dimmed" ta="center">
                UMAP Visualization
              </Text>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Create Workspace Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Workspace"
        size="sm"
      >
        <Stack gap="md">
          <TextInput
            label="Workspace Name"
            placeholder="e.g., Research Project"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
            autoFocus
          />
          
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Color
            </Text>
            <Group gap="xs">
              {WORKSPACE_COLORS.map((color) => (
                <ColorSwatch
                  key={color}
                  color={`var(--mantine-color-${color}-6)`}
                  size={24}
                  style={{ cursor: 'pointer', border: selectedColor === color ? '2px solid black' : 'none' }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </Group>
          </Box>

          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName.trim()}>
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
