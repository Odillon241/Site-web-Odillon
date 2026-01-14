# SECURITY INCIDENT REPORT - Exposed Credentials

**Date**: 2025-12-03
**Severity**: 🚨 CRITICAL
**Status**: ✅ Git history cleaned, ⚠️ Credentials still need rotation

## Summary

The `.env.production` file containing real Supabase credentials was committed to git history (commit `5d5b55d`) and pushed to GitHub at `https://github.com/Danel2025/Site-web-Odillon.git`.

## Exposed Credentials

The following credentials were exposed in commit history:

- **Supabase URL**: `https://wicstfeflqkacazsompx.supabase.co`
- **Anon Key**: JWT token (visible in commit `5d5b55d`)
- **Service Role Key**: JWT token (visible in commit `5d5b55d`)
- **Admin Email**: `dereckdanel@odillon.fr`

## Actions Taken

✅ **Git History Cleaned**: The `.env.production` file has been completely removed from all git history using `git-filter-repo`.

✅ **Verification**: Confirmed file no longer appears in any commit.

⚠️ **Force Push Required**: The cleaned history needs to be force-pushed to GitHub to replace the compromised history.

## IMMEDIATE ACTIONS REQUIRED

### 1. Rotate Supabase Credentials (URGENT)

Even though the file is removed from history, anyone who cloned or accessed the repository before this fix may still have access to the credentials. **You must rotate these keys immediately**.

#### Steps to Rotate Supabase Keys:

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `wicstfeflqkacazsompx`

2. **Rotate the Anon Key**
   - Navigate to **Settings** > **API**
   - Click **"Rotate anon key"** or **"Generate new anon key"**
   - Copy the new key

3. **Rotate the Service Role Key**
   - In the same **Settings** > **API** section
   - Click **"Rotate service_role key"** or **"Generate new service_role key"**
   - ⚠️ **WARNING**: This will immediately invalidate the old key
   - Copy the new key

4. **Update Environment Variables**
   - Update `.env.local` with new keys
   - Update `.env.production` with new keys
   - Update keys on your production server (Infomaniak VPS)
   - Update keys in any CI/CD environments

5. **Restart Services**
   - Restart the Next.js dev server: `npm run dev`
   - Restart production server: `pm2 restart odillon-site`

### 2. Force Push to GitHub (WARNING)

The cleaned git history needs to be pushed to GitHub to replace the compromised history.

⚠️ **IMPORTANT WARNINGS**:
- This will **rewrite GitHub history** and change all commit SHAs
- Anyone who has cloned the repository will need to **re-clone** or reset their local copies
- Branches and pull requests may be affected
- Make sure you've backed up any important uncommitted work

#### Steps to Force Push:

```bash
# Make sure you're on the main branch
git branch

# Force push to GitHub (this will overwrite remote history)
git push origin main --force

# If you have other branches, force push them too
git push origin --all --force

# Force push tags if any
git push origin --tags --force
```

### 3. Notify Team Members

If others have access to this repository:
- Inform them that the git history has been rewritten
- Ask them to **delete their local clones** and **re-clone** the repository
- Do NOT attempt to merge or pull - they must re-clone
- Share the new Supabase credentials securely (never via email or Slack)

### 4. Review GitHub Access

Check who has had access to the repository:
- Go to https://github.com/Danel2025/Site-web-Odillon/settings/access
- Review collaborators and team members
- Consider if the repository was ever public
- Check GitHub's "Insights" > "Traffic" to see if anyone cloned it

### 5. Monitor for Unauthorized Access

After rotating keys, monitor your Supabase project for:
- Unexpected API requests
- New user registrations
- Database modifications
- Storage access patterns

Go to Supabase Dashboard > **Logs** > **API Logs** and **Database Logs**

## Prevention Measures

To prevent this from happening again:

1. ✅ `.env.production` is already in `.gitignore`
2. ✅ Consider using `.env.example` files with placeholder values for documentation
3. ✅ Use environment variable management tools (like Vercel env, Doppler, or AWS Secrets Manager)
4. ✅ Set up pre-commit hooks to prevent committing `.env*` files:

```bash
# Install pre-commit hook
npm install --save-dev husky
npx husky init
echo "npx --no -- lint-staged" > .husky/pre-commit
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "**/*": [
      "sh -c 'if git diff --cached --name-only | grep -q \"\\.env\"; then echo \"ERROR: .env file detected in commit. Aborting.\"; exit 1; fi'"
    ]
  }
}
```

## Status Checklist

- [x] Git history cleaned
- [x] `.env.production` removed from all commits
- [x] Origin remote re-added
- [ ] **Force push to GitHub** (waiting for user confirmation)
- [ ] **Supabase Anon Key rotated**
- [ ] **Supabase Service Role Key rotated**
- [ ] New credentials updated in `.env.local`
- [ ] New credentials updated in `.env.production`
- [ ] New credentials deployed to production server
- [ ] Team members notified
- [ ] Repository access reviewed

## Next Steps

1. **FIRST**: Rotate Supabase credentials immediately (see steps above)
2. **SECOND**: Force push to GitHub (after confirming backups are safe)
3. **THIRD**: Update credentials on all environments
4. **FOURTH**: Monitor Supabase logs for suspicious activity

## Contact

If you need help with any of these steps:
- Supabase Support: https://supabase.com/support
- GitHub Support: https://support.github.com

---

**Generated**: 2025-12-03
**Tool Used**: git-filter-repo v2.47.0
