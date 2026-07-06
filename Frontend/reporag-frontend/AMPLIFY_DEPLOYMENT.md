# AWS Amplify Deployment Guide

## Prerequisites
- Git repository (GitHub, GitLab, Bitbucket, or AWS CodeCommit)
- AWS Account with access to Amplify Console
- Cognito User Pool already configured with Google OAuth

## Step 1: Push Code to Git Repository

Make sure your code is in a Git repository that AWS Amplify can access:

```bash
git add .
git commit -m "Prepare frontend for Amplify deployment"
git push origin main
```

## Step 2: Deploy to AWS Amplify

### 2.1 Create Amplify App

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Select your Git provider (GitHub, GitLab, etc.)
4. Authorize AWS Amplify to access your repository
5. Select your repository and branch (e.g., `main`)
6. Click **Next**

### 2.2 Configure Build Settings

1. **App name**: `reporag-frontend` (or your preferred name)
2. **Environment**: `prod` or `main`
3. **Build and test settings**: Amplify should auto-detect `amplify.yml`
   - Base directory: `Frontend/reporag-frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Advanced settings** (expand)
5. Add the following **Environment variables**:

   | Variable Name | Value |
   |--------------|-------|
   | `VITE_COGNITO_USER_POOL_ID` | `ap-south-1_C3zLO5kqK` |
   | `VITE_COGNITO_CLIENT_ID` | `3es7gnlt5jr2rdiv5tc8614gbb` |
   | `VITE_COGNITO_REGION` | `ap-south-1` |
   | `VITE_COGNITO_DOMAIN` | `https://ap-south-1c3zlo5kqk.auth.ap-south-1.amazoncognito.com` |
   | `VITE_API_BASE_URL` | `https://0mx0rw42nd.execute-api.ap-south-1.amazonaws.com/prod` |

   **Note**: Don't add `VITE_OAUTH_REDIRECT_SIGN_IN` and `VITE_OAUTH_REDIRECT_SIGN_OUT` yet — we'll update these after deployment.

6. Click **Next**
7. Review and click **Save and deploy**

### 2.3 Wait for Deployment

The first deployment takes 3-5 minutes. Amplify will:
- Provision resources
- Clone your repository
- Install dependencies (`npm ci`)
- Build your app (`npm run build`)
- Deploy to CloudFront CDN

Once complete, you'll see a **green checkmark** and your app URL will look like:
```
https://main.d1234abcd.amplifyapp.com
```

**Copy this URL** — you'll need it for the next steps.

## Step 3: Update OAuth Redirect URLs

Now that you have your Amplify URL, update the redirect URLs:

### 3.1 Update Cognito App Client

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Select your User Pool: `ap-south-1_C3zLO5kqK`
3. Go to **App integration** → **App client list**
4. Select your app client: `3es7gnlt5jr2rdiv5tc8614gbb`
5. Scroll to **Hosted UI settings**
6. Update **Allowed callback URLs**:
   ```
   http://localhost:5173/
   https://main.d1234abcd.amplifyapp.com/
   ```
   *(Replace with your actual Amplify URL)*

7. Update **Allowed sign-out URLs**:
   ```
   http://localhost:5173/
   https://main.d1234abcd.amplifyapp.com/
   ```

8. Click **Save changes**

### 3.2 Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Select your OAuth 2.0 Client ID
4. Update **Authorized redirect URIs** to include:
   ```
   https://ap-south-1c3zlo5kqk.auth.ap-south-1.amazoncognito.com/oauth2/idpresponse
   ```
5. Save

### 3.3 Update Amplify Environment Variables

1. Back in Amplify Console, go to your app
2. Click **App settings** → **Environment variables**
3. Add/update:
   - `VITE_OAUTH_REDIRECT_SIGN_IN`: `https://main.d1234abcd.amplifyapp.com/`
   - `VITE_OAUTH_REDIRECT_SIGN_OUT`: `https://main.d1234abcd.amplifyapp.com/`

4. Click **Save**
5. Go to **Deployments** tab → Click **Redeploy this version** (this rebuilds with new env vars)

## Step 4: Update Backend CORS

Update your backend to allow requests from the new Amplify URL:

1. Open `p:\RepoRAG_Structured\samconfig.toml`
2. Update the `FrontendOrigin` parameter:
   ```toml
   parameter_overrides = [
       "PineconeApiKey=pcsk_6FnfSW_KqknoPjJqYJgz54CFYh3ALgyAN1exKPudKgvHK7ou4ehqR7NzT1qqAXrpvcdsPG",
       "GeminiApiKey=AIzaSyAJq3VGc0cBqPMW9971TOEPecOILVIdXf8",
       "FrontendOrigin=http://localhost:5173,https://main.d1234abcd.amplifyapp.com",
       "BedrockRegion=us-east-1",
   ]
   ```
   *(Replace with your actual Amplify URL)*

3. Redeploy the backend:
   ```powershell
   .\deploy.ps1
   ```

## Step 5: Test Your Deployment

1. Visit your Amplify URL: `https://main.d1234abcd.amplifyapp.com`
2. You should see the login page with:
   - Email/password fields
   - **"Continue with Google"** button ✨
3. Click "Continue with Google" and verify the OAuth flow works
4. After login, test scanning and querying a repository

## Continuous Deployment

Every time you push to your connected branch, Amplify will automatically:
1. Pull the latest code
2. Rebuild the app
3. Deploy the new version

## Custom Domain (Optional)

To use your own domain (e.g., `reporag.yourdomain.com`):

1. In Amplify Console, go to **Domain management**
2. Click **Add domain**
3. Enter your domain name
4. Follow the DNS configuration steps
5. Update all redirect URLs to use your custom domain

## Troubleshooting

### OAuth redirect mismatch error
- Verify all redirect URLs in Cognito exactly match your Amplify URL (with trailing `/`)
- Check environment variables in Amplify Console

### Build fails
- Check **Build logs** in Amplify Console
- Verify `amplify.yml` has correct base directory: `Frontend/reporag-frontend`

### CORS errors
- Verify backend `FrontendOrigin` includes your Amplify URL
- Redeploy backend after updating `samconfig.toml`

### Google login doesn't work
- Check Google Cloud Console has correct redirect URI
- Verify Cognito has Google identity provider configured
- Check that `VITE_COGNITO_DOMAIN` is set correctly

## Need Help?

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [AWS Cognito Social Sign-In](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html)
