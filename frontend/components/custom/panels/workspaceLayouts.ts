// config/workspaceLayouts.ts
import Editor from '~/components/custom/panels/toppanel/EditorPanel/Editor.vue'
import DirectoryTree from '~/components/custom/explorer/DirectoryTree.vue'
import ChatInterface from '~/components/custom/chat/ChatInterface.vue'
import BottomPanel from '~/components/custom/panels/bottompanel/BottomPanel.vue'
import type { WorkspaceLayouts } from './types/panels'

export const workspaceLayouts: WorkspaceLayouts = {
  requirements: {
    topSection: {
      defaultSize: 70,
      horizontal: [
        {
          id: 'directory',
          component: DirectoryTree,
          defaultSize: 25,
          minSize: 15
        },
        {
          id: 'editor',
          component: Editor,
          defaultSize: 50
        },
        {
          id: 'chat',
          component: ChatInterface,
          defaultSize: 25
        }
      ]
    },
    bottomSection: {
      defaultSize: 30
    }
  },
  
  development: {
    topSection: {
      defaultSize: 80,
      horizontal: [
        {
          id: 'directory',
          component: DirectoryTree,
          defaultSize: 20
        },
        {
          id: 'editor',
          component: Editor,
          defaultSize: 60
        },
        {
          id: 'chat',
          component: ChatInterface,
          defaultSize: 20
        }
      ]
    },
    bottomSection: {
      defaultSize: 20
    }
  },

  testing: {
    topSection: {
      defaultSize: 60,
      horizontal: [
        {
          id: 'directory',
          component: DirectoryTree,
          defaultSize: 20,
          hidden: true
        },
        {
          id: 'editor',
          component: Editor,
          defaultSize: 50
        },
        {
          id: 'chat',
          component: ChatInterface,
          defaultSize: 30
        }
      ]
    },
    bottomSection: {
      defaultSize: 40
    }
  }
  // Add more workspace layouts as needed
}