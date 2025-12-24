# SynPhytica - Vercel Deployment Guide

## Quick Deploy

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub: `symbeon-labs/synphytica-core`
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. Environment Variables
Configure in Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_APP_NAME=SynPhytica
NEXT_PUBLIC_APP_VERSION=0.2.0
```

Optional (configure later when contracts are deployed):
```bash
NEXT_PUBLIC_GHOSTFUND_DONATION_CONTRACT=<contract_address>
NEXT_PUBLIC_GHOSTFUND_SEAL_CONTRACT=<contract_address>
NEXT_PUBLIC_GHOSTFUND_REPUTATION_CONTRACT=<contract_address>
NEXT_PUBLIC_TRINITY_WEBHOOK_URL=<webhook_url>
```

### 3. Deploy
Click "Deploy" - Vercel will automatically build and deploy.

## Post-Deploy Checklist

- [ ] Visit deployment URL
- [ ] Test homepage
- [ ] Click "SUPPORT RESEARCH" button
- [ ] Navigate to `/docs`
- [ ] Verify responsive design (mobile/desktop)
- [ ] Check browser console for errors

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

## Monitoring

- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Deployments → [deployment] → Logs
- **Performance**: Use Lighthouse in Chrome DevTools

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing variables

### 404 Errors
- Verify routes exist in `src/app/`
- Check `next.config.ts` configuration

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: https://github.com/symbeon-labs/synphytica-core/issues
