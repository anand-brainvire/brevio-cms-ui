# Brevio CMS UI - React Admin Panel

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Architecture & Patterns](#architecture--patterns)
- [Development Guidelines](#development-guidelines)
- [Component Library](#component-library)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Styling & UI](#styling--ui)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Brevio CMS UI is a comprehensive React-based admin panel built with modern web technologies. It provides a robust foundation for content management systems with features like user management, role-based access control, content management, and analytics dashboard.

### Key Characteristics
- **TypeScript-first**: Full TypeScript implementation with strict type checking
- **Component-driven**: Reusable, modular component architecture
- **GraphQL-powered**: Apollo Client for efficient data fetching
- **Role-based security**: Granular permission system
- **Internationalization**: Multi-language support with i18next
- **Responsive design**: Mobile-first approach with Tailwind CSS

## ✨ Features

### Core Functionality
- **Authentication & Authorization**: Secure login/logout with JWT tokens and role-based access control
- **User Management**: Complete CRUD operations for users, sub-admins, and roles
- **Content Management**: Dynamic content creation, editing, and publishing
- **File Management**: Advanced media library with upload, organize, and manage capabilities
- **Dashboard Analytics**: Real-time statistics and data visualization
- **Multi-language Support**: Internationalization with translation management

### Advanced Features
- **Real-time Notifications**: Toast notifications and system alerts
- **Data Export**: Excel, PDF, and CSV export functionality
- **Advanced Filtering**: Complex search and filter capabilities
- **Image Processing**: Crop, resize, and optimize images
- **Payment Integration**: Stripe payment processing
- **Geolocation Services**: Map integration with Google Maps and Mapbox
- **Activity Tracking**: Comprehensive audit trails

## 🛠 Technology Stack

### Core Technologies
- **React 18.2.0** - Modern React with hooks and concurrent features
- **TypeScript 4.9.4** - Type-safe JavaScript development
- **GraphQL** - Efficient data querying with Apollo Client
- **Tailwind CSS 3.2.4** - Utility-first CSS framework

### Key Libraries

| Category | Library | Version | Purpose |
|----------|---------|---------|---------|
| **State Management** | Apollo Client | ^3.7.4 | GraphQL client with caching |
| **Forms** | Formik | ^2.2.9 | Form handling and validation |
| **Validation** | Yup | ^0.32.11 | Schema validation |
| **UI Components** | PrimeReact | 9.5.0 | Rich UI component library |
| **Routing** | React Router DOM | ^6.6.1 | Client-side routing |
| **Internationalization** | i18next | ^22.4.9 | Multi-language support |
| **Charts** | Recharts | ^3.0.2 | Data visualization |
| **Maps** | @react-google-maps/api | ^2.19.3 | Google Maps integration |
| **Payments** | @stripe/react-stripe-js | ^2.5.0 | Stripe payment processing |
| **Security** | crypto-js | ^4.1.1 | Data encryption/decryption |
| **Date/Time** | moment | ^2.29.4 | Date manipulation |
| **Notifications** | react-toastify | ^9.1.3 | Toast notifications |

### Development Tools
- **CRACO** - Create React App Configuration Override
- **Husky** - Git hooks for pre-commit validation
- **ESLint** - Code linting and formatting
- **Commitlint** - Commit message validation

## 📋 Prerequisites

### System Requirements
- **Node.js**: >= 20.11.0
- **npm**: >= 10.2.4
- **Git**: Latest version

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Brave (latest)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd brevio-cms-ui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_GATEWAY_URL=https://your-api-gateway-url.com/graphql
REACT_APP_API_IMAGE_URL=https://your-image-api-url.com
REACT_APP_API_BASENODE=https://your-base-node-url.com

# Security
REACT_APP_ENCRYPTION_DECRYPTION_KEY=your-encryption-key

# Optional: Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

### 4. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── assets/               # Static assets (images, icons, fonts)
├── components/           # Reusable UI components
│   ├── BVDatatable/      # Custom data table component
│   ├── button/           # Button components
│   ├── common/           # Common UI elements
│   ├── filter/           # Filter components
│   ├── form/             # Form components
│   ├── icons/            # SVG icons
│   ├── layout/           # Layout components
│   └── roleGuard/        # Permission-based component guards
├── config/               # Configuration files
│   ├── constant.tsx      # Application constants
│   ├── permission.tsx    # Permission definitions
│   └── regex.ts          # Regular expressions
├── framework/            # External integrations
│   ├── graphql/          # GraphQL client and queries
│   └── rest/             # REST API integrations
├── hooks/                # Custom React hooks
│   ├── validations/      # Form validation schemas
│   └── custom/           # Custom business logic hooks
├── layout/               # Page layouts
├── services/             # Business logic services
├── styles/               # Global styles and SCSS
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── views/                # Page components (CRUD operations)
```

## 🏗 Architecture & Patterns

### Component Architecture
The application follows a hierarchical component structure:

1. **Layout Components** (`src/layout/`)
   - `DefaultLayout.tsx` - Main application layout
   - `PublicLayout.tsx` - Public pages layout

2. **View Components** (`src/views/`)
   - Each module has its own directory
   - Follows CRUD pattern: `index.tsx`, `addEdit.tsx`, `filter.tsx`

3. **Reusable Components** (`src/components/`)
   - Generic components used across modules
   - Follow single responsibility principle

### Data Flow Pattern
```
GraphQL Query/Mutation → Apollo Client → Component State → UI Rendering
```

### State Management
- **Local State**: React hooks (`useState`, `useReducer`)
- **Server State**: Apollo Client cache
- **Form State**: Formik with Yup validation
- **Global State**: Context API for theme/auth

## 📝 Development Guidelines

### Code Standards

#### TypeScript Configuration
- Strict type checking enabled
- No implicit `any` types
- Strict null checks
- Path aliases for clean imports

#### File Naming Conventions
- **Components**: PascalCase (`Button.tsx`, `UserManagement.tsx`)
- **Hooks**: camelCase (`useValidation.tsx`, `useSaveFilterData.tsx`)
- **Utilities**: camelCase (`helpers.ts`, `constants.ts`)
- **Types**: camelCase with `.d.ts` extension (`user.d.ts`, `common.d.ts`)


### Git Workflow

#### Commit Message Format
```
TICKET-123: Brief description of changes - [Status: Done]
```

Examples:
- `TASK-120: Implement user management module - [Status: Done]`
- `BUG-45: Fix login validation issue - [Status: In Progress]`

#### Branch Strategy
- `main` - Production-ready code
- `staging` - Pre-production testing
- `dev` - Development branch
- Feature branches: `feature/TASK-123-description`

### Pre-commit Hooks
- **ESLint**: Code linting and formatting
- **TypeScript**: Type checking
- **Husky**: Git hook management

```typescript
const { userValidationSchema } = useValidation();

const formik = useFormik({
  initialValues,
  validationSchema: userValidationSchema,
  onSubmit: handleSubmit,
});
```

#### useSaveFilterData
Persistent filter state management.

```typescript
const { localFilterData } = useSaveFilterData();
const [filterData, setFilterData] = useState(
  localFilterData('filterUsers') ?? defaultFilter
);
```

## 🔌 API Integration

### GraphQL Setup
Apollo Client configuration with authentication and error handling:

// Mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      data {
        id
        uuid
      }
      message
    }
  }
`;
```

### Error Handling
Centralized error handling with automatic token refresh:

```typescript
const errorLink = onError(({ graphQLErrors, forward, operation }) => {
  if (graphQLErrors?.length) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'INVALID_TOKEN') {
        // Handle token refresh
      }
    }
  }
});
```

#### Color Palette
```scss
// Primary colors
$primary: #6200FF;
$secondary: #21005D;

// Status colors
$success: #4dbd74;
$warning: #ffc107;
$danger: #f86c6b;
$info: #28d3cd;
```

#### Typography
- **Primary Font**: System font stack
- **Headings**: Custom font weights and sizes
- **Body Text**: Optimized for readability

#### Component Styling
- **Tailwind CSS**: Utility-first approach
- **SCSS Modules**: Component-specific styles
- **Responsive Design**: Mobile-first approach

### Custom Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#6200FF',
        secondary: '#21005D',
        // Custom color palette
      },
      spacing: {
        'sidebar-space': '12.5rem',
      },
      // Custom utilities
    },
  },
};
```

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User workflow testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Analyze bundle size
npm run analyze
```

### Environment Configuration
- **Development**: `.env.development`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

### CI/CD Pipeline
The project includes Azure DevOps pipeline configuration:


## 🤝 Contributing

### Development Workflow
1. Create feature branch from `dev`
2. Implement changes following coding standards
3. Write/update tests
4. Submit pull request
5. Code review and approval
6. Merge to `dev` branch

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] Components are memoized where appropriate
- [ ] Form validation is implemented
- [ ] Error handling is in place
- [ ] Accessibility features are included
- [ ] Responsive design is maintained
- [ ] Tests are written and passing

### Documentation
- Update README for new features
- Document API changes
- Update component documentation
- Maintain changelog

## 📊 Quality Metrics

### SonarQube Integration
- **Quality Gate**: [![Quality Gate Status](https://sonarqube.brainvire.com/api/project_badges/measure?project=NodeJS-Base-Structure-sonarqube&metric=alert_status&token=sqb_2c2483ae3332dc3a37d241ddd9c027c1946c2eb5)](https://sonarqube.brainvire.com/dashboard?id=NodeJS-Base-Structure-sonarqube)
- **Code Coverage**: Maintained above 80%
- **Code Duplication**: Kept below 3%
- **Technical Debt**: Regularly addressed

### Performance Metrics
- **Bundle Size**: Optimized with code splitting
- **Load Time**: < 3 seconds initial load
- **Runtime Performance**: Optimized with React.memo and useMemo

## 🔐 Security

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Secure token storage with encryption

### Authorization
- Role-based access control (RBAC)
- Permission-based component rendering
- API-level permission validation

### Data Protection
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure HTTP headers

### Documentation
- **Component Library**: See individual component README files
- **API Documentation**: GraphQL schema documentation
- **Architecture Guide**: Detailed in this README

### Contact
For technical support or questions, please contact the development team.