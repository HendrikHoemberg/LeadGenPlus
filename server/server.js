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
    const { formData, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
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
1. Use the web_search tool to find real, current information about companies matching the criteria
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
- Use ### for sub-headers (e.g., "### Contact Information")
- Use **bold** for field labels (e.g., **Unternehmensname:** Company GmbH)
- Use - or * for bullet points
- Separate each lead with clear headers
- Keep paragraphs concise and well-structured
- DO NOT use excessive markdown symbols or complex formatting
- Present data in a clean, scannable format

OUTPUT INSTRUCTIONS:
- Use web search to find real companies matching these criteria
- Present each lead with clear ## headers for company names
- For each field, use **field name:** followed by the value
- Include the best available contact information from company sources
- If specific HR contact isn't public, use general company contact (phone/email from contact page)
${searchMode === 'accurate' ? '- CRITICAL: Do NOT include apologetic messages, disclaimers, or explanations about data limitations. Just present the leads with available information.' : '- If specific information truly is not available, state "Not publicly available" for that field'}
- Organize leads with clear separations between each company
- Stop after finding ${maxResults} qualifying leads

Begin your web search and provide the lead information now.`;

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
    let content = '';
    let citations = [];
    
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

    // Generate PDF
    const pdfBuffer = await generatePDF(content, citations, formData);
    const pdfBase64 = pdfBuffer.toString('base64');

    res.json({
      pdfBase64,
      summary: content.substring(0, 200) + '...',
      webSearchUsed: data.usage?.server_tool_use?.web_search_requests || 0
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
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#1a56db').text('LeadGen Plus', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(16).fillColor('#4b5563').text('Lead Generation Report', { align: 'center' });
      doc.moveDown(1);

      // Metadata section
      doc.fontSize(10).fillColor('#6b7280');
      doc.text(`Generated: ${new Date().toLocaleDateString('de-DE', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })}`, { align: 'right' });
      doc.moveDown(1);

      // Search criteria box
      const criteriaY = doc.y;
      doc.moveDown(0.5);
      
      doc.fontSize(12).fillColor('#111827').font('Helvetica-Bold').text('Search Criteria', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').fillColor('#374151');
      
      if (formData.companyDescription) {
        doc.text(`Description: ${formData.companyDescription}`, { width: doc.page.width - 120 });
      }
      if (formData.locations?.length > 0) {
        doc.text(`Locations: ${formData.locations.join(', ')}`);
      }
      if (formData.industry?.length > 0) {
        doc.text(`Industries: ${formData.industry.join(', ')}`);
      }
      if (formData.companySizeMin || formData.companySizeMax) {
        doc.text(`Company Size: ${formData.companySizeMin || 'Any'} - ${formData.companySizeMax || 'Any'} employees`);
      }
      if (formData.personas?.length > 0) {
        doc.text(`Target Personas: ${formData.personas.join(', ')}`);
      }
      
      doc.moveDown(0.5);
      const boxHeight = doc.y - criteriaY;
      doc.rect(50, criteriaY, doc.page.width - 100, boxHeight).lineWidth(1).strokeColor('#e5e7eb').stroke();
      doc.moveDown(1);

      // Main content
      doc.fontSize(14).fillColor('#111827').font('Helvetica-Bold').text('Lead Results', { underline: true });
      doc.moveDown(0.5);

      // Parse Markdown and render to PDF
      renderMarkdownToPDF(doc, content);

      // Citations section (if any)
      if (citations && citations.length > 0) {
        if (doc.y > doc.page.height - 200) {
          doc.addPage();
        } else {
          doc.moveDown(2);
        }
        
        doc.fontSize(14).fillColor('#111827').font('Helvetica-Bold').text('Sources & Citations', { underline: true });
        doc.moveDown(0.5);

        citations.forEach((citation, idx) => {
          if (doc.y > doc.page.height - 100) {
            doc.addPage();
          }
          
          doc.fontSize(9).font('Helvetica-Bold').fillColor('#4b5563');
          doc.text(`[${idx + 1}] ${citation.title || 'Source'}`, { link: citation.url, underline: true, color: '#1a56db' });
          if (citation.url) {
            doc.fontSize(8).font('Helvetica').fillColor('#6b7280').text(citation.url, { indent: 20 });
          }
          if (citation.cited_text) {
            doc.fontSize(8).fillColor('#374151').text(`"${citation.cited_text}"`, { indent: 20 });
          }
          doc.moveDown(0.3);
        });
      }

      // Footer on last page
      doc.fontSize(8).fillColor('#9ca3af').text(
        'Generated by LeadGen Plus - AI-Powered Lead Generation',
        50,
        doc.page.height - 30,
        { align: 'center', width: doc.page.width - 100 }
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
  
  for (let i = 0; i < lines.length; i++) {
    // Check if we need a new page
    if (doc.y > doc.page.height - 100) {
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
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#1a56db').text(headerText);
      doc.moveDown(0.4);
      continue;
    }
    
    if (trimmedLine.match(/^##\s+(.+)/)) {
      if (inList) { inList = false; listIndent = 0; }
      const headerText = trimmedLine.replace(/^##\s+/, '');
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#1a56db').text(headerText);
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
      
      doc.fontSize(10).fillColor('#111827');
      doc.x = 50 + listIndent;
      doc.text('• ', { continued: true, font: 'Helvetica' });
      renderInlineFormattedText(doc, processedText);
      doc.moveDown(0.2);
      continue;
    }

    // Regular paragraphs
    if (inList) {
      inList = false;
      listIndent = 0;
    }
    
    // Process inline markdown
    const processedText = processInlineMarkdown(trimmedLine);
    doc.fontSize(10).fillColor('#111827');
    renderInlineFormattedText(doc, processedText);
    doc.moveDown(0.3);
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
  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    
    switch (segment.type) {
      case 'bold':
        doc.font('Helvetica-Bold').fillColor('#111827').text(segment.text, { continued: !isLast });
        break;
      case 'code':
        doc.font('Courier').fillColor('#374151').text(segment.text, { continued: !isLast });
        break;
      default:
        doc.font('Helvetica').fillColor('#111827').text(segment.text, { continued: !isLast });
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 LeadGen Plus API Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
