# OpenAI Chat Application Features

## Core Features

### Chat Management
- Multiple chat conversations support
- Create new chat sessions
- Switch between different chat conversations
- Persistent chat storage across sessions
- Default system message configuration

### Message Handling
- Real-time chat messaging
- Markdown rendering support
- GitHub Flavored Markdown (GFM) enabled
- Message timestamp tracking
- Message history preservation

### OpenAI Integration
- OpenAI API integration
- Support for multiple OpenAI models
- Configurable OpenAI parameters
- API key configuration
- Token counting functionality

### User Interface
- Modern, responsive design with Tailwind CSS
- Chat message bubbles with hover effects
- Chat input component
- Chat controls for message management
- Settings modal for configuration
- Token counter display
- Custom styling with gradients and animations

### Settings & Configuration
- Customizable chat settings
- Persistent settings storage
- OpenAI parameter configuration
  - Model selection
  - Temperature
  - Other model-specific parameters
- System message customization

### Technical Features
- Built with Angular 18
- Reactive state management using RxJS
- Local storage integration
- Modular component architecture
- Tailwind CSS with typography plugin
- Responsive design support

## Components

### Core Components
- Chat Message Component (`ChatMessageComponent`)
- Chat Input Component (`ChatInputComponent`)
- Chat Controls Component (`ChatControlsComponent`)
- Chat List Component (`ChatListComponent`)
- Settings Modal Component (`SettingsModalComponent`)
- Token Counter Component (`TokenCounterComponent`)
- API Key Config Component (`ApiKeyConfigComponent`)

### Services
- Chat Service (`ChatService`)
- OpenAI Service (`OpenAIService`)
- Chat Manager Service (`ChatManagerService`)
- Settings Service (`SettingsService`)
- Storage Service (`StorageService`)
- Markdown Service (`MarkdownService`)
- Config Service (`ConfigService`)

## Styling
- Custom button styles with hover effects
- Message bubble animations
- Gradient backgrounds
- Typography optimization
- Responsive layout
- Dark/light theme support through Tailwind

## Development Features
- Development server with hot reload
- Production build optimization
- TypeScript support
- PostCSS processing
- Tailwind CSS configuration