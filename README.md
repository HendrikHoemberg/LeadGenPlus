# LeadGen Plus

An AI-powered lead generation tool that uses advanced AI web search capabilities to find real business contacts and company information based on your specific criteria.

## Features

- **Dual AI Provider Support**: Choose between Claude AI or Google Gemini for lead generation
  - **Claude AI**: Advanced web search with citation support
  - **Google Gemini**: Fast and efficient with models Flash (speed) and Pro (quality)
- **AI-Powered Research**: Leverages AI web search tools to find actual companies and contact information
- **Customizable Output Fields**: Configure exactly what information you want to collect for each lead
- **Flexible Search Modes**: Choose between accurate (strict matching) or loose (partial matching) search modes
- **Query Management**: Save and reuse successful search queries
- **Search History**: Track all previous searches with PDF exports
- **Multi-language Support**: Available in English and German
- **Dark Mode**: Toggle between light and dark themes
- **Enhanced PDF Export**: Automatically generates beautifully formatted PDF reports with:
  - Professional blue gradient header design
  - Numbered lead badges with styled boxes
  - Color-coded field labels and values
  - Citations with clickable links (Claude only)
  - Modern rounded corners and shadows
  - High-contrast, accessible color scheme
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
- Google Gemini API
- PDFKit for PDF generation

## Prerequisites

- Node.js (v16 or higher recommended, v18+ for best compatibility)
- npm (comes with Node.js)
- API key for your chosen AI provider:
  - Anthropic API key with web search enabled (for Claude)
  - Google AI API key (for Gemini)

## Installation

### Step 1: Install Node.js

Node.js is required to run both the frontend and backend servers.

#### macOS Installation

Using Homebrew (recommended):
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

Alternative using official installer:
1. Visit https://nodejs.org/
2. Download the macOS installer (LTS version recommended)
3. Run the installer and follow the prompts
4. Verify installation by opening Terminal and running `node --version`

#### Linux Installation

**Ubuntu/Debian:**
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

**Fedora/RHEL/CentOS:**
```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

**Using Node Version Manager (nvm) - Recommended for all Linux distributions:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell configuration
source ~/.bashrc  # or ~/.zshrc if using zsh

# Install latest LTS version of Node.js
nvm install --lts

# Verify installation
node --version
npm --version
```

#### Windows Installation

**Download and install:**
1. Visit https://nodejs.org/
2. Download the Windows installer (LTS version recommended)
3. Run the installer and follow the installation wizard
4. Restart your computer after installation
5. Verify installation by opening PowerShell or Command Prompt and running:
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Quick Start (Windows Only)

**Windows users can skip the remaining steps!**

Simply double-click the `LeadGenPlus.exe` file in the project folder. This will automatically:
- Install all required dependencies (if not already installed)
- Start both the frontend and backend servers
- Open the application in your default browser

**Non-Windows users**, please continue with Steps 3-5 below.

### Step 3: Clone and Install Dependencies (Non-Windows)

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

### Step 4: Configure Your API Key

1. Start the application (see Step 5)
2. Click the "Settings" button in the top-right corner
3. Select your preferred AI provider (Claude or Gemini)
4. Enter your API key:
   - **For Claude**: Get your API key from https://console.anthropic.com/
   - **For Gemini**: Get your API key from https://aistudio.google.com/app/apikey
5. If using Gemini, select your preferred model:
   - **Flash**: Faster, more cost-effective
   - **Pro**: Higher quality, more comprehensive results
6. The key is stored locally in your browser (localStorage)

**Enable web search in Anthropic Console (Claude users only):**
- Visit https://console.anthropic.com/settings/privacy
- Enable web search for your organization

### Step 5: Run the Application (Non-Windows)

You have two options to start the application:

**Option A: Using the start script (macOS/Linux)**
```bash
# Make the script executable (first time only)
chmod +x start.sh

# Run the start script
./start.sh
```

**Option B: Manual start**

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

## AI Provider Comparison

### Claude AI (Anthropic)
**Strengths:**
- Advanced web search with direct citations
- Excellent at finding and validating contact information
- Source attribution for each piece of data
- High accuracy in data extraction

**Best for:**
- When you need source citations
- Maximum accuracy and validation
- Complex research queries

**Requirements:**
- Anthropic API key
- Web search must be enabled in console
- Slightly higher cost per search

**Pricing:**
- Token-based pricing (input + output tokens)
- Web search: $10 per 1,000 searches
- See: https://www.anthropic.com/pricing

### Google Gemini
**Strengths:**
- Very fast response times
- Cost-effective for high-volume searches
- Two model options (Flash and Pro)
- Built-in grounding with Google Search

**Best for:**
- High-volume lead generation
- Budget-conscious users
- When speed is a priority

**Models:**
- **Gemini 2.5 Flash**: Fastest, most economical
- **Gemini 2.5 Pro**: Higher quality, more thorough

**Requirements:**
- Google AI API key (free tier available)
- No additional setup required

**Pricing:**
- Free tier available with rate limits
- Very competitive pricing for paid tier
- See: https://ai.google.dev/pricing

### Choosing the Right Provider

- **Use Claude if**: You need citations, maximum accuracy, or are doing legal/compliance research
- **Use Gemini if**: You need speed, cost-effectiveness, or are generating high volumes of leads
- **Switch between**: You can change providers anytime in Settings to compare results

## Usage

### Selecting Your AI Provider

1. Click the "Settings" button in the top-right corner
2. Choose between Claude or Gemini
3. Enter your API key for the selected provider
4. If using Gemini, select your preferred model (Flash or Pro)
5. Save your settings

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

### Claude AI
1. Claude receives your search criteria
2. Automatically performs web searches to find matching companies
3. Extracts contact information from websites, business directories, and public sources
4. Validates and formats the data according to your output fields
5. Generates a PDF with all found leads and **source citations**

### Google Gemini
1. Gemini receives your search criteria
2. Uses Google Search grounding to find relevant information
3. Extracts and structures company and contact data
4. Processes results according to your output fields
5. Generates a formatted PDF report

### What Can Be Found

- Company websites and contact pages
- LinkedIn and XING profiles
- Business directories
- Industry publications
- Press releases
- Official registrations
- Public business databases

### Limitations

- Cannot access paywalled content
- Cannot access private databases
- Limited to publicly indexed information
- Results depend on online presence of companies
- Gemini does not provide source citations (unlike Claude)

## Pricing

### Claude API
- **Token-based pricing**: Based on input + output tokens
- **Web Search**: $10 per 1,000 searches
- Each web search counts as one use
- Failed searches are not billed

Example cost for 10 leads with 5 searches:
- Web search: $0.05
- Plus token costs for Claude processing

Learn more: https://www.anthropic.com/pricing

### Google Gemini API
- **Free tier available** with generous rate limits
- **Very competitive pricing** for paid usage
- **No additional web search fees**
- Cost scales with number of tokens processed

Example cost for 10 leads:
- Significantly lower than Claude in most cases
- No separate web search charges
- Free tier may cover many use cases

Learn more: https://ai.google.dev/pricing

### Cost Comparison

For high-volume lead generation, Gemini is typically more cost-effective. For research requiring citations and maximum accuracy, Claude may be worth the additional cost.

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
- API keys (Claude and Gemini): localStorage
- AI provider preference: localStorage
- Gemini model selection: localStorage
- Saved queries: localStorage
- Search history: localStorage
- Theme preference: localStorage
- Language preference: localStorage

No data is sent to external servers except:
- API requests to Anthropic (for Claude) or Google (for Gemini)
- Web searches performed by the selected AI provider

## Troubleshooting

### No Results Found
- Make criteria more specific
- Try loose search mode
- Increase max results
- If using Claude: Verify web search is enabled in Anthropic Console
- Try switching AI providers to compare results

### API Errors
- Check that the correct API key is entered for your selected provider
- Verify your API key is valid and active
- Ensure you haven't exceeded rate limits
- Check backend server is running (should be on http://localhost:3001)
- Verify internet connection
- If using Claude: Ensure web search is enabled in console

### Slow Performance
- Reduce max results
- If using Claude: Reduce max_uses in server config
- Make search criteria more specific
- Try switching to Gemini Flash for faster results

### Windows Users: Executable Not Working
- Ensure Node.js is installed (run `node --version` in PowerShell)
- Right-click the exe and select "Run as Administrator"
- Check that ports 3001 and 5173 are not already in use
- Try running `start.bat` instead

### macOS/Linux: Permission Denied
- Make scripts executable: `chmod +x start.sh`
- Ensure Node.js and npm are properly installed
- Try running with `sudo` if needed for port binding

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

### v2.0.0 (Current)
- **Multi-provider Support**: Added Google Gemini as alternative to Claude
- **Gemini Models**: Support for both Flash (speed) and Pro (quality) models
- **Multi-language**: Added German language support
- **Enhanced UI**: Improved settings modal with provider selection
- **Cost Optimization**: Option to use more cost-effective Gemini API
- **Windows Executable**: Quick-start exe file for Windows users
- **Improved Installation**: Comprehensive Node.js installation guide for all platforms

### v1.0.0
- Initial release
- AI-powered lead generation with Claude
- Web search integration
- PDF export functionality
- Dark mode support
- Query management system
