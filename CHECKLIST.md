# MazadAuto — Production Checklist

## Infrastructure
- [ ] Supabase project created (production, not local)
- [ ] RLS enabled and tested on ALL tables
- [ ] Supabase daily backups enabled
- [ ] Supabase auth email templates updated (French)
- [ ] Storage buckets created with correct policies
  - [ ] vehicle-photos: public read
  - [ ] kyc-documents: private (signed URLs only)
  - [ ] vehicle-documents: private
- [ ] pg_cron extension enabled
- [ ] Edge functions deployed and tested
- [ ] Supabase connection pooling enabled (PgBouncer)

## Services
- [ ] Resend: domain mazadauto.tn verified (DNS: SPF, DKIM, DMARC)
- [ ] Resend: test email sent and received
- [ ] Twilio: Tunisia number active
- [ ] Upstash Redis: project created, keys copied
- [ ] Sentry: project created, first error captured

## Vercel
- [ ] Project connected to GitHub repo
- [ ] All env variables set in Vercel dashboard
- [ ] Custom domain mazadauto.tn configured
- [ ] SSL certificate active
- [ ] Preview deployment tested
- [ ] Production deployment successful
- [ ] Vercel Analytics enabled

## Security
- [ ] Security headers verified (use securityheaders.com)
- [ ] Rate limiting tested (bid spam attempt blocked)
- [ ] File upload validation tested (wrong type rejected)
- [ ] RLS tested (user cannot read other users' data)
- [ ] Admin routes inaccessible to non-admins

## SEO
- [ ] sitemap.xml accessible at mazadauto.tn/sitemap.xml
- [ ] robots.txt correct at mazadauto.tn/robots.txt
- [ ] OG image renders correctly (use opengraph.xyz to test)
- [ ] Structured data valid (Google Rich Results Test)
- [ ] Google Search Console: site submitted

## Testing
- [ ] All Playwright tests passing locally
- [ ] All Playwright tests passing in CI (GitHub Actions)
- [ ] Tested on real iPhone Safari
- [ ] Tested on real Android Chrome
- [ ] Lighthouse: Performance > 85
- [ ] Lighthouse: SEO > 95
- [ ] Lighthouse: Accessibility > 80

## Business
- [ ] Admin account created in production DB
- [ ] First test vehicle listed and auctioned end-to-end
- [ ] Notification emails received correctly
- [ ] SMS received (if Twilio configured)
- [ ] KYC approval flow tested by admin
- [ ] CGU/politique de confidentialité pages live

## Go-live
- [ ] DNS propagated (mazadauto.tn → Vercel)
- [ ] HTTPS working
- [ ] www redirect configured (www → non-www or vice versa)
- [ ] 404 page tested
- [ ] Error page tested
- [ ] Sentry receiving production errors
