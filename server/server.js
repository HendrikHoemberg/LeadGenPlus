import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import PDFDocument from 'pdfkit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'LeadGen Plus API Server' });
});

// Proxy endpoint for Anthropic API
app.post('/api/generate-leads', async (req, res) => {
  try {
    const { formData, apiKey, aiProvider = 'claude', geminiModel = 'gemini-2.5-flash' } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!aiProvider || !['claude', 'gemini'].includes(aiProvider)) {
      return res.status(400).json({ error: 'Invalid AI provider. Must be "claude" or "gemini"' });
    }

    const enabledFields = formData.outputFields
      .filter(field => field.enabled)
      .map(field => field.label);

    const requiredFields = formData.outputFields
      .filter(field => field.enabled && field.required)
      .map(field => field.label);

    const searchMode = formData.searchMode || 'accurate';
    const maxResults = formData.maxResults || 10;

    const accurateModeInstructions = searchMode === 'accurate' 
      ? `
ACCURATE SEARCH MODE (STRICT):
- ONLY include leads where you can find ALL of these REQUIRED fields with verified information:
${requiredFields.map((field, index) => `  ${index + 1}. ${field}`).join('\n')}
- If you cannot find complete information for ANY required field, SKIP that lead entirely
- Optional fields (not in the required list above) can be marked as "Not publicly available"
- Do NOT include leads with missing required fields
- Focus on quality over quantity - better to have fewer complete leads
- Do NOT include apologetic messages or disclaimers about data limitations
- Simply present the complete leads you found without commentary about what you couldn't find
- Maximum leads to include: ${maxResults}
${requiredFields.length === 0 ? '  ⚠️ NOTE: No required fields specified - all enabled fields are optional' : ''}
`
      : `
LOOSE SEARCH MODE (FLEXIBLE):
- Include leads even if some fields are not available
- For missing information, clearly state "Not publicly available" for that specific field
- Prioritize leads with more complete information first
- You may include general company contact information when specific contact persons are not found
- Maximum leads to include: ${maxResults}
`;

    const prompt = `You are a professional lead generation expert with web search capabilities. Your task is to research and provide practical, actionable contact information for qualified leads.

CRITICAL REQUIREMENTS:
1. Use the web_search tool (Claude) or google_search tool (Gemini) to find real, current information about companies matching the criteria
2. Search for companies in the specified locations and industries
3. Provide contact information found through reliable public sources
4. DO NOT generate fictional, exemplary, or placeholder data
5. Use information from credible sources such as:
   - Company websites (official contact pages, team pages, "About Us" sections)
   - Professional networks (LinkedIn, XING profiles)
   - Official business directories (Bundesanzeiger, IHK, industry associations)
   - Company press releases and news articles
   - Trade association member listings

WHAT COUNTS AS ACCEPTABLE INFORMATION:
✅ Contact information directly from company websites
✅ Phone numbers listed on official company contact pages
✅ Email addresses in the format shown on company websites (even if general like info@company.de)
✅ Names and positions from company "Team" or "About Us" pages
✅ LinkedIn/XING profiles showing current employment at the company
✅ Contact details from official business registries
✅ Information from recent press releases or company news

❌ DO NOT use information that appears outdated (>2 years old)
❌ DO NOT fabricate or guess email formats
❌ DO NOT include contact information from third-party recruiting sites unless it's the only available source

${accurateModeInstructions}

Search Criteria:
Company Description: ${formData.companyDescription}
Target Locations: ${formData.locations.join(', ')}
Industries: ${formData.industry.join(', ')}
Company Size: ${formData.companySizeMin || 'Any'} to ${formData.companySizeMax || 'Any'} employees
Target Personas: ${formData.personas.join(', ')}
Additional Criteria: ${formData.additionalCriteria || 'None'}

Required Information for Each Lead (in this exact order):
${enabledFields.map((field, index) => `${index + 1}. ${field}`).join('\n')}

PRACTICAL GUIDANCE FOR CONTACT INFORMATION:
- **Company Name**: Always available from search results
- **Contact Person**: Look for team pages, "About Us", HR department listings, management bios
- **Position/Title**: Usually shown with contact person on company website
- **Phone**: Use main company number from contact page (add extension if available)
- **Email**: 
  * Best: Direct email from company website (name.surname@company.de)
  * Good: Department email (personal@company.de, hr@company.de, info@company.de)
  * Acceptable: General company email if specific contacts aren't public
- **Location**: From company address/headquarters
- **Website**: Always available from search results

FORMATTING INSTRUCTIONS:
Your output will be converted to PDF. Use clean, professional Markdown formatting:
- Use ## for main section headers (e.g., "## Lead 1: Company Name")
- Use ### for sub-headers if needed (e.g., "### Contact Information")
- Use **bold** for field labels (e.g., **Unternehmensname:** Company GmbH)
- Use - or * for bullet points
- Separate each lead with clear headers
- Keep paragraphs concise and well-structured
- DO NOT use excessive markdown symbols or complex formatting
- Present data in a clean, scannable format

OUTPUT FORMAT - FOLLOW THIS STRUCTURE EXACTLY:

## Lead 1: [Company Name]
* **Unternehmensname:** [Full company name]
* **Ansprechpartner:** [Contact person name]
* **Position:** [Job title]
* **Telefonnummer:** [Phone number]
* **E-Mail:** [Email address]
* **Ort:** [City/Location]
* **Website:** [Company website]

## Lead 2: [Company Name]
* **Unternehmensname:** [Full company name]
* **Ansprechpartner:** [Contact person name]
* **Position:** [Job title]
* **Telefonnummer:** [Phone number]
* **E-Mail:** [Email address]
* **Ort:** [City/Location]
* **Website:** [Company website]

[Continue for all leads...]

CRITICAL OUTPUT RULES:
1. DO NOT include any introductory text, explanations, or commentary before the leads
2. DO NOT include phrases like "I'll search for..." or "Based on my research..."
3. DO NOT add disclaimers or apologetic messages about data availability
4. START IMMEDIATELY with "## Lead 1: [Company Name]"
5. Use ONLY the bullet point format shown above for each lead
6. Do NOT wrap field values in parentheses or add extra notes
7. Keep the output clean and structured - ONLY the lead data
8. After all leads, you may add a "## Sources & Citations" section with numbered references

OUTPUT INSTRUCTIONS:
- Use web search to find real companies matching these criteria
- Present ONLY the leads in the exact format shown above
- Start directly with ## Lead 1: [Company Name] - NO preamble
- Include the best available contact information from company sources
- If specific HR contact isn't public, use general company contact (phone/email from contact page)
${searchMode === 'accurate' ? '- CRITICAL: Present ONLY the structured lead data. NO explanations, disclaimers, or commentary.' : '- If specific information truly is not available, state "Not publicly available" for that field'}
- Organize leads with clear separations between each company
- Stop after finding ${maxResults} qualifying leads

Begin your web search and provide ONLY the structured lead data now - no preamble or explanations.`;

    let content = '';
    let citations = [];

    // Route to appropriate AI provider
    if (aiProvider === 'claude') {
      // Call Anthropic API with web search tool
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          tools: [
            {
              type: 'web_search_20250305',
              name: 'web_search',
              max_uses: 100
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: errorData.error?.message || `API Error: ${response.status} ${response.statusText}`,
        });
      }

      const data = await response.json();
      
      // Extract all text content from the response (web search may return multiple content blocks)
      if (data.content && Array.isArray(data.content)) {
        // Extract text blocks
        const textBlocks = data.content.filter(block => block.type === 'text');
        content = textBlocks.map(block => block.text).join('\n\n');
        
        // Extract citations
        textBlocks.forEach(block => {
          if (block.citations && Array.isArray(block.citations)) {
            citations.push(...block.citations);
          }
        });
      }
    } else if (aiProvider === 'gemini') {
      // Call Google Gemini API with google_search tool
      const ai = new GoogleGenAI({ apiKey });
      
      const groundingTool = {
        googleSearch: {},
      };
      
      const config = {
        tools: [groundingTool],
      };
      
      const result = await ai.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config,
      });
      
      // Extract text content
      content = result.text;
      
      // Extract grounding metadata if available
      if (result.candidates && result.candidates[0]?.groundingMetadata) {
        const metadata = result.candidates[0].groundingMetadata;
        
        // Convert grounding chunks to citations format
        if (metadata.groundingChunks) {
          citations = metadata.groundingChunks.map((chunk, idx) => {
            if (chunk.web) {
              return {
                title: chunk.web.title || `Source ${idx + 1}`,
                url: chunk.web.uri,
                cited_text: '' // Gemini doesn't provide cited text in the same way
              };
            }
            return null;
          }).filter(Boolean);
        }
      }
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(content, citations, formData);
    const pdfBase64 = pdfBuffer.toString('base64');

    res.json({
      pdfBase64,
      summary: content.substring(0, 200) + '...',
      webSearchUsed: aiProvider === 'claude' 
        ? (data?.usage?.server_tool_use?.web_search_requests || 0)
        : 'N/A'
    });
  } catch (error) {
    console.error('Error generating leads:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while generating leads',
    });
  }
});

// Function to generate a professionally formatted PDF from Markdown content
function generatePDF(content, citations, formData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 60, bottom: 60, left: 60, right: 60 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      // Helper to draw a gradient-like header bar
      const drawHeaderBar = () => {
        // Purple gradient effect with rectangles
        doc.rect(0, 0, doc.page.width, 120).fill('#6d28d9');
        doc.rect(0, 0, doc.page.width, 100).fill('#7c3aed');
        doc.rect(0, 0, doc.page.width, 80).fill('#a855f7');
      };

      // Header with styled background
      drawHeaderBar();
      
      // Title
      doc.fontSize(32).font('Helvetica-Bold').fillColor('#ffffff').text('LeadGen Plus', 60, 25);
      doc.fontSize(14).font('Helvetica').fillColor('#e0e7ff').text('Lead Generation Report', 60, 60);
      
      // Date badge
      const dateStr = new Date().toLocaleDateString('de-DE', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
      const dateWidth = doc.widthOfString(dateStr);
      doc.roundedRect(doc.page.width - dateWidth - 90, 30, dateWidth + 30, 25, 5)
         .fill('#5b21b6');
      doc.fontSize(9).font('Helvetica').fillColor('#ffffff').text(dateStr, doc.page.width - dateWidth - 75, 38);
      
      // Reset position after header
      doc.y = 130;

      // Main content header with icon
      doc.fontSize(16).fillColor('#7c3aed').font('Helvetica-Bold').text('Lead Results', 60, doc.y, { align: 'left' });
      
      // Decorative line under header
      doc.moveTo(60, doc.y + 5)
         .lineTo(doc.page.width - 60, doc.y + 5)
         .lineWidth(2)
         .strokeColor('#7c3aed')
         .stroke();
      
      doc.moveDown(1);

      // Parse Markdown and render to PDF
      renderMarkdownToPDF(doc, content);

      // Citations section (if any)
      if (citations && citations.length > 0) {
        if (doc.y > doc.page.height - 200) {
          doc.addPage();
        } else {
          doc.moveDown(2);
        }
        
        // Citations header with icon
        doc.fontSize(16).fillColor('#7c3aed').font('Helvetica-Bold').text('Sources & Citations', { underline: false });
        
        // Decorative line
        doc.moveTo(60, doc.y + 5)
           .lineTo(doc.page.width - 60, doc.y + 5)
           .lineWidth(2)
           .strokeColor('#7c3aed')
           .stroke();
        
        doc.moveDown(1);

        citations.forEach((citation, idx) => {
          if (doc.y > doc.page.height - 100) {
            doc.addPage();
          }
          
          // Citation box
          const citationY = doc.y;
          doc.fontSize(9).font('Helvetica-Bold').fillColor('#7c3aed');
          doc.text(`[${idx + 1}] ${citation.title || 'Source'}`, { link: citation.url, underline: true });
          
          if (citation.url) {
            doc.fontSize(8).font('Helvetica').fillColor('#6b7280').text(citation.url, { indent: 20 });
          }
          if (citation.cited_text) {
            doc.fontSize(8).fillColor('#374151').text(`"${citation.cited_text}"`, { indent: 20 });
          }
          
          // Subtle separator line
          doc.moveDown(0.2);
          doc.moveTo(60, doc.y)
             .lineTo(doc.page.width - 60, doc.y)
             .lineWidth(0.5)
             .strokeColor('#e5e7eb')
             .stroke();
          doc.moveDown(0.3);
        });
      }

      // Footer on last page with enhanced styling
      const footerY = doc.page.height - 40;
      doc.rect(0, footerY - 10, doc.page.width, 50).fill('#f3f4f6');
      doc.fontSize(8).font('Helvetica').fillColor('#6b7280').text(
        'Generated by LeadGen Plus - AI-Powered Lead Generation',
        60,
        footerY,
        { align: 'center', width: doc.page.width - 120 }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to render Markdown content to PDF
function renderMarkdownToPDF(doc, markdown) {
  const lines = markdown.split('\n');
  let inList = false;
  let listIndent = 0;
  let leadCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    // Check if we need a new page
    if (doc.y > doc.page.height - 120) {
      doc.addPage();
    }

    let line = lines[i];
    const trimmedLine = line.trim();
    
    // Empty line
    if (!trimmedLine) {
      if (inList) {
        inList = false;
        listIndent = 0;
      }
      doc.moveDown(0.3);
      continue;
    }

    // Headers (## or ###)
    if (trimmedLine.match(/^###\s+(.+)/)) {
      if (inList) { inList = false; listIndent = 0; }
      const headerText = trimmedLine.replace(/^###\s+/, '');
      
      // Sub-header with background
      const subHeaderY = doc.y;
      doc.roundedRect(60, subHeaderY - 2, doc.page.width - 120, 20, 3)
         .fill('#e9d5ff');
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#7c3aed').text(headerText, 65, subHeaderY);
      doc.moveDown(0.8);
      continue;
    }
    
    if (trimmedLine.match(/^##\s+(.+)/)) {
      if (inList) { inList = false; listIndent = 0; }
      const headerText = trimmedLine.replace(/^##\s+/, '');
      leadCount++;
      
      // Estimate the height needed for this lead (header + typical content)
      // Look ahead to count bullet points for this lead
      let bulletCount = 0;
      for (let j = i + 1; j < lines.length && j < i + 20; j++) {
        const nextLine = lines[j].trim();
        if (nextLine.match(/^##\s+(.+)/)) {
          break; // Next lead found
        }
        if (nextLine.match(/^[-*]\s+(.+)/)) {
          bulletCount++;
        }
      }
      
      // Estimate height: header (30) + bullets (bulletCount * 20) + padding (40)
      const estimatedLeadHeight = 30 + (bulletCount * 20) + 40;
      
      // Check if lead fits on current page, if not start new page
      if (doc.y + estimatedLeadHeight > doc.page.height - 80) {
        doc.addPage();
      }
      
      // Add spacing before new lead (except first)
      if (leadCount > 1) {
        doc.moveDown(0.5);
      }
      
      // Lead header with styled box
      const leadHeaderY = doc.y;
      const leadHeaderHeight = 28;
      
      // Shadow effect
      doc.roundedRect(62, leadHeaderY + 2, doc.page.width - 124, leadHeaderHeight, 5)
         .fill('#d1d5db');
      
      // Main header box with gradient-like effect - now purple
      doc.roundedRect(60, leadHeaderY, doc.page.width - 120, leadHeaderHeight, 5)
         .fill('#a855f7');
      
      // Lead number badge - centered
      doc.circle(75, leadHeaderY + 14, 10).fill('#7c3aed');
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff').text(leadCount.toString(), 70, leadHeaderY + 9, { align: 'center', width: 10 });
      
      // Lead title
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#ffffff').text(headerText, 95, leadHeaderY + 7);
      
      doc.y = leadHeaderY + leadHeaderHeight;
      doc.moveDown(0.5);
      continue;
    }

    // Bullet points (- or *)
    if (trimmedLine.match(/^[-*]\s+(.+)/)) {
      inList = true;
      listIndent = 20;
      const bulletText = trimmedLine.replace(/^[-*]\s+/, '');
      
      // Process inline markdown in bullet text
      const processedText = processInlineMarkdown(bulletText);
      
      // Alternating background for better readability
      if (leadCount % 2 === 0) {
        doc.rect(60, doc.y - 2, doc.page.width - 120, 18).fill('#fafafa');
      }
      
  doc.fontSize(10).fillColor('#1f2937');
  doc.x = 60 + listIndent;
  // Use WinAnsi-supported bullet to avoid encoding artifacts
  doc.fillColor('#a855f7').font('Helvetica').text('• ', { continued: true });
  renderInlineFormattedText(doc, processedText);
      doc.moveDown(0.3);
      continue;
    }

    // Regular paragraphs
    if (inList) {
      inList = false;
      listIndent = 0;
    }
    
    // Process inline markdown
    const processedText = processInlineMarkdown(trimmedLine);
    doc.fontSize(10).fillColor('#1f2937');
    renderInlineFormattedText(doc, processedText);
    doc.moveDown(0.3);
  }
  
  // Add a final separator after all leads
  if (leadCount > 0) {
    doc.moveDown(0.5);
    doc.moveTo(60, doc.y)
       .lineTo(doc.page.width - 60, doc.y)
       .lineWidth(1)
       .strokeColor('#a855f7')
       .stroke();
  }
}

// Process inline markdown (**bold**, `code`, etc.)
function processInlineMarkdown(text) {
  const segments = [];
  let currentPos = 0;
  
  // Regex to match **bold**, `code`
  const inlineRegex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let match;
  
  while ((match = inlineRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentPos) {
      segments.push({
        text: text.substring(currentPos, match.index),
        type: 'normal'
      });
    }
    
    // Add the formatted segment
    const matchedText = match[0];
    if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
      segments.push({
        text: matchedText.slice(2, -2),
        type: 'bold'
      });
    } else if (matchedText.startsWith('`') && matchedText.endsWith('`')) {
      segments.push({
        text: matchedText.slice(1, -1),
        type: 'code'
      });
    }
    
    currentPos = match.index + matchedText.length;
  }
  
  // Add remaining text
  if (currentPos < text.length) {
    segments.push({
      text: text.substring(currentPos),
      type: 'normal'
    });
  }
  
  return segments.length > 0 ? segments : [{ text, type: 'normal' }];
}

// Render text with inline formatting
function renderInlineFormattedText(doc, segments) {
  // Manage font/color state changes explicitly to avoid PDF encoding glitches
  let currentFont = 'Helvetica';
  let currentColor = '#1f2937';

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;

    let newFont = 'Helvetica';
    let newColor = '#1f2937';

    if (segment.type === 'bold') {
      newFont = 'Helvetica-Bold';
      newColor = '#7c3aed';
    } else if (segment.type === 'code') {
      newFont = 'Courier';
      newColor = '#7c3aed';
    }

    if (newFont !== currentFont) {
      doc.font(newFont);
      currentFont = newFont;
    }
    if (newColor !== currentColor) {
      doc.fillColor(newColor);
      currentColor = newColor;
    }

    doc.text(segment.text, { continued: !isLast });
  });

  // Reset defaults
  doc.font('Helvetica').fillColor('#1f2937');
}

app.listen(PORT, () => {
  console.log(`🚀 LeadGen Plus API Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
