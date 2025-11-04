# LeadGen Plus

An AI-powered lead generation tool that uses Claude's web search capabilities to find real business contacts and company information based on your specific criteria.

## Features

- **AI-Powered Research**: Leverages Claude's web search tool to find actual companies and contact information
- **Customizable Output Fields**: Configure exactly what information you want to collect for each lead
- **Flexible Search Modes**: Choose between accurate (strict matching) or loose (partial matching) search modes
- **Query Management**: Save and reuse successful search queries
- **Search History**: Track all previous searches with PDF exports
- **Dark Mode**: Toggle between light and dark themes
- **PDF Export**: Automatically generates PDF reports with all found leads
- **Real-time Data**: Searches current web sources for up-to-date information

## Technology Stack

### Frontend
- React 19.1.1
- TypeScript 5.9.3
- Tailwind CSS 4.1.16
- Vite 7.1.7

### Backend
- Node.js
- Express 4.18.2
- Claude AI API (Anthropic)
- PDFKit for PDF generation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Anthropic API key with web search enabled

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LeadGenPlus
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

4. Configure your API key:
   - Open the application
   - Click the "Settings" button in the top-right corner
   - Enter your Anthropic API key
   - The key is stored locally in your browser

5. Enable web search in Anthropic Console:
   - Visit https://console.anthropic.com/settings/privacy
   - Enable web search for your organization

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd server
npm start
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Production Build

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Basic Lead Generation

1. **Company Description**: Describe your company and what you offer
2. **Target Locations**: Add locations where you want to find leads (e.g., "Berlin", "Munich")
3. **Industries**: Specify target industries (e.g., "Technology", "Healthcare")
4. **Company Size**: Optionally specify minimum and maximum employee counts
5. **Target Personas**: Add job titles of your ideal contacts (e.g., "CEO", "CTO")
6. **Additional Criteria**: Any other specific requirements

### Output Fields Configuration

Customize what information is collected for each lead:
- Toggle fields on/off
- Mark fields as required (in accurate mode)
- Add custom fields
- Reorder fields by dragging

Default fields include:
- Company Name
- Contact Person Name
- Position/Title
- Phone Number
- Email Address
- Location
- Website

### Search Modes

**Accurate Mode**:
- Only returns leads with all required fields filled
- Higher quality, fewer results
- Best for when you need complete information

**Loose Mode**:
- Returns partial matches
- More results, varying completeness
- Good for broad research

### Max Results

Control the number of leads returned (1-50):
- Lower numbers = faster, less token usage
- Higher numbers = more comprehensive results
- Consider API costs when setting this value

### Saving and Loading Queries

**Save Query**: 
- Save your current search parameters for reuse
- Access via "Saved" button

**History**: 
- View all previous searches
- Download PDFs of past results
- Reload search parameters

## Configuration

### Backend Settings (server/server.js)

```javascript
{
  type: 'web_search_20250305',
  name: 'web_search',
  max_uses: 10,  // Maximum searches per request
  user_location: {
    type: 'approximate',
    city: 'Siegen',
    region: 'Nordrhein-Westfalen',
    country: 'DE',
    timezone: 'Europe/Berlin'
  }
}
```

Customize:
- `max_uses`: Number of web searches allowed per request
- `user_location`: Localize results to your region
- `allowed_domains`: Restrict to specific websites (optional)
- `blocked_domains`: Exclude specific websites (optional)

### Environment Variables

Create a `.env` file in the `server` directory if needed:
```
PORT=3001
```

## How Web Search Works

1. Claude receives your search criteria
2. Automatically performs web searches to find matching companies
3. Extracts contact information from websites, business directories, and public sources
4. Validates and formats the data according to your output fields
5. Generates a PDF with all found leads and source citations

### What Can Be Found

- Company websites and contact pages
- LinkedIn and XING profiles
- Business directories
- Industry publications
- Press releases
- Official registrations

### Limitations

- Cannot access paywalled content
- Cannot access private databases
- Limited to publicly indexed information
- Results depend on online presence of companies

## Pricing

- **Claude API**: Based on token usage (input + output)
- **Web Search**: $10 per 1,000 searches
- Each web search counts as one use
- Failed searches are not billed

Example cost for 10 leads with 5 searches:
- Web search: $0.05
- Plus token costs for Claude processing

## Project Structure

```
LeadGenPlus/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── HistoryModal.tsx
│   │   ├── OutputFieldsManager.tsx
│   │   ├── SavedQueriesModal.tsx
│   │   ├── SettingsModal.tsx
│   │   └── TagInput.tsx
│   ├── context/           # React context for settings
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions and API calls
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── server/                # Backend Express server
│   ├── server.js          # API proxy and PDF generation
│   └── package.json       # Backend dependencies
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## Data Storage

All data is stored locally in your browser:
- API key: localStorage
- Saved queries: localStorage
- Search history: localStorage
- Theme preference: localStorage

No data is sent to external servers except:
- API requests to Anthropic (via backend proxy)
- Web searches performed by Claude

## Troubleshooting

### No Results Found
- Make criteria more specific
- Try loose search mode
- Increase max results
- Verify web search is enabled in Anthropic Console

### API Errors
- Check API key is valid
- Ensure web search is enabled
- Check backend server is running
- Verify internet connection

### Slow Performance
- Reduce max results
- Reduce max_uses in server config
- Make search criteria more specific

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Development
```bash
cd server
npm start            # Start server
```

## Contributing

Contributions are welcome. Please ensure:
- Code follows existing style
- TypeScript types are properly defined
- Components are properly documented
- Test your changes thoroughly

## License

This project is private and proprietary.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the WEB_SEARCH_INFO.md documentation
3. Check Anthropic API documentation
4. Contact the development team

## Version History

### v1.0.0 (Current)
- Initial release
- AI-powered lead generation
- Web search integration
- PDF export functionality
- Dark mode support
- Query management system
