# Forland Dashboard

A comprehensive admin dashboard for managing banking website content, built with React, TypeScript, and Tailwind CSS. Features a modern UI with dark mode support and rich text editing capabilities.

## 🚀 Features

- **Content Management**: Full CRUD operations for all website content
- **Menu Management**: Create and edit menu categories, subcategories, and items
- **Banner Image Upload**: Upload and manage banner images for subcategories
- **Rich Text Editor**: Tiptap-based editor for content creation
- **File Uploads**: Image and PDF upload support
- **Dark Mode**: Full dark mode theme support
- **Responsive Design**: Mobile-friendly admin interface
- **Authentication**: JWT-based secure authentication
- **Real-time Updates**: Instant feedback on all operations

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd forlanddashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=https://service.mwalimubank.co.tz
```

4. Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📁 Project Structure

```
forlanddashboard/
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components (shadcn/ui)
│   │   ├── MenuCategoryForm.tsx
│   │   ├── MenuItemForm.tsx
│   │   └── ...
│   ├── lib/               # API client and utilities
│   │   └── api.js         # API functions
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   ├── App.tsx            # Main app component
│   └── index.tsx          # Entry point
├── public/                # Static assets
└── package.json
```

## 🎨 Key Features

### Menu Category Management
- Create and edit menu categories
- Manage subcategories with banner image uploads
- Position management
- Active/inactive status toggle

### Menu Item Management
- Full page content editor
- Rich text editor for accordion items
- Banner image upload (legacy support)
- Features and benefits management
- Dynamic form based on selected category

### Content Modules
- **Products**: Product listings with images
- **News & Updates**: News articles with images
- **Investor News**: Investor-related content
- **Carousel**: Homepage carousel items
- **Board of Directors**: Team member profiles
- **Management**: Management team profiles
- **FAQs**: Frequently asked questions
- **Foreign Exchange**: Currency rate management
- **Wakala**: Branch/agent locations
- **Investor Categories**: PDF document management

## 🎯 Key Components

### MenuCategoryForm
- Subcategory management
- **Banner Image Upload**: Upload banner images for each subcategory
- Preview existing banners
- File upload with preview functionality

### MenuItemForm
- Dynamic category/subcategory selection
- Rich text editor for content
- Accordion items management
- Features and benefits lists
- Banner image upload (legacy)

### Rich Text Editor
- Based on Tiptap
- Full formatting options
- HTML output
- Dark mode compatible

## 🔌 API Integration

All API calls are handled through `src/lib/api.js`:

- Authentication endpoints
- CRUD operations for all modules
- File upload handling
- Error handling and token management

## 🎨 UI Components

Built with shadcn/ui and Radix UI:
- Buttons, Inputs, Labels
- Dialogs, Dropdowns, Selects
- Toast notifications
- Checkboxes, Switches
- Tabs, Collapsible
- Progress indicators

## 🌙 Dark Mode

Full dark mode support:
- Theme-aware components
- Automatic color adaptation
- Persistent theme preference
- Smooth transitions

## 📤 File Uploads

### Supported Formats
- **Images**: JPG, PNG, GIF, WebP
- **PDFs**: For investor categories

### Upload Process
1. Select file in form
2. Preview before upload
3. Upload on form submission
4. URL stored in database

## 🔐 Authentication

- JWT token-based authentication
- Token stored in localStorage
- Automatic token refresh
- Protected routes
- Login/logout functionality

## 📝 Form Features

### Validation
- Required field validation
- Type checking
- Error messages
- Form state management

### Rich Text Editing
- Tiptap editor integration
- HTML content support
- Formatting toolbar
- Placeholder support

## 🚀 Build & Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

The build folder contains optimized production files.

### Environment Variables
- `REACT_APP_API_URL`: Backend API base URL (required)

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Dark/light mode support
- **Responsive**: Mobile-first design
- **Components**: Reusable component library

## 📱 Responsive Design

Fully responsive across all devices:
- Desktop: Full feature set
- Tablet: Optimized layout
- Mobile: Touch-friendly interface

## 🔄 Data Flow

1. **Form Submission**: User fills form
2. **File Upload**: Upload files if any
3. **API Call**: Send data to backend
4. **Response**: Handle success/error
5. **Navigation**: Redirect on success
6. **Toast**: Show notification

## 📋 Available Modules

1. **Menu Categories**: Category and subcategory management
2. **Menu Items**: Page content management
3. **Products**: Product listings
4. **News**: News articles
5. **Investor News**: Investor content
6. **Carousel**: Homepage slides
7. **Board of Directors**: Board members
8. **Management**: Management team
9. **FAQs**: Frequently asked questions
10. **Foreign Exchange**: Currency rates
11. **Wakala**: Branch locations
12. **Investor Categories**: PDF documents
13. **Statistics**: Dashboard statistics

## 🐛 Troubleshooting

### API Connection Issues
- Verify `REACT_APP_API_URL` in `.env`
- Check backend is running
- Verify CORS settings
- Check browser console for errors

### File Upload Issues
- Check file size limits
- Verify file format
- Check network connection
- Review backend upload settings

### Authentication Issues
- Clear localStorage
- Re-login
- Check token expiration
- Verify JWT_SECRET matches backend

## 🛠️ Development

### Adding New Modules
1. Create form component
2. Add API functions in `api.js`
3. Add route in `App.tsx`
4. Create list component
5. Add navigation link

### Customizing UI
- Modify Tailwind config
- Update component styles
- Adjust theme colors
- Customize components

## 📄 License

Private - All rights reserved

## 🔗 Related Repositories

- **Backend API**: [forlandservice](../README.md)
- **Website**: [finbank](../finbank/README.md)

## 👥 Support

For issues and questions, please contact the development team.
