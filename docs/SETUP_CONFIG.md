# Configuration Setup

This project uses local configuration files that contain machine-specific settings and should not be committed to version control.

## Initial Setup

After cloning the repository, you need to create your local configuration files from the provided templates:

### 1. MCP Server Configuration

```bash
# Copy the template
cp .mcp.json.example .mcp.json
```

Then edit `.mcp.json` to configure your MCP servers. The default configuration includes:
- **TestSprite**: Test automation MCP server
- **Supabase**: Local Supabase MCP server (requires Supabase running on localhost:54321)
- **Next DevTools**: Next.js development tools

### 2. Claude Code Settings

```bash
# Create the local settings directory if needed
mkdir -p .claude

# Copy the template
cp .claude/settings.local.json.example .claude/settings.local.json
```

The `.claude/settings.local.json` file contains Claude Code permissions and MCP server configurations. The template includes sensible defaults for this project.

## Environment Variables

Don't forget to also set up your `.env.local` file with Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=admin@odillon.com
```

## Files Ignored by Git

The following files contain machine-specific or sensitive information and are excluded from version control:

- `.mcp.json` - MCP server configuration
- `.claude/settings.local.json` - Claude Code settings
- `.env*.local` - Environment variables
- `.env.production` - Production environment variables

**Never commit these files.** Always use the `.example` templates as reference for new setups.

## Troubleshooting

If you see git trying to track these files:
1. Verify they are listed in `.gitignore`
2. Remove them from tracking: `git rm --cached <filename>`
3. The files will remain on your local system but won't be tracked by git
