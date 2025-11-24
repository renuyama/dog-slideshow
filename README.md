# 🐶 Dog Explorer – API Powered Slideshow (React)

Dog Explorer is a React-based web application that displays an automated slideshow of dog images using the public [Dog CEO API](https://dog.ceo/dog-api/). Users can select a breed from a dropdown menu, and the app dynamically loads and animates images for the chosen breed.

This project is an enhanced React implementation of the tutorial **“Dogs, JavaScript & An API 🐶 Fetch, Promises & Async Await”** created by **Brad Schiff (LearnWebCode)**. Full credit goes to him for the original concept and initial implementation idea.

---

## 🚀 Features

- Fetches dog breeds dynamically from the Dog CEO API  
- Displays multiple breed images in a rotating slideshow  
- Smooth fade and scale animation between slides  
- Built entirely with React functional components and hooks  
- Automatically deployed to Azure Static Web Apps using GitHub Actions  
- Responsive UI that works on desktop and mobile  

---

## 🛠️ Technologies Used

- **React** (Create React App)
- **JavaScript (ES6+)**
- **Fetch API / JSON**
- **Azure Static Web Apps**
- **GitHub Actions CI/CD**

---

----------------------------------------------------------
Prerequisites
----------------------------------------------------------
Before starting, make sure the following are installed or available:

1. Node.js (version 18 or higher)
2. Git (installed locally)
3. GitHub Account
4. Azure Subscription (Azure for Students works)
5. GoDaddy Domain (optional for custom domain setup)

----------------------------------------------------------
Step 1 — Clone the Repository
----------------------------------------------------------
Clone the project from GitHub:

    git clone https://github.com/renuyama/dog-slideshow
    cd dog-slideshow
    npm install
    npm start

Your local server should now display the Dog Slideshow React App.

----------------------------------------------------------
Step 2 — Build the React Project
----------------------------------------------------------
Create a production build that Azure will deploy:

    npm run build

A folder named "build" will be generated in your project directory.

----------------------------------------------------------
Step 3 — Deploy to Azure Static Web Apps
----------------------------------------------------------
1. Go to:
   https://portal.azure.com

2. Click:
   "Create a resource" → "Static Web App"

3. Fill out the form:

   Field                Value
   --------------------------------------------------
   App Name             dog-slideshow
   Region               Global
   Deployment Source    GitHub

4. Authorize Azure to access your GitHub account.

5. Choose the repository details:

   Setting              Value
   --------------------------------------------------
   Repository           renuyama/dog-slideshow
   Branch               main
   Build Preset         React
   App Location         /
   Output Location      build

6. Click "Create"

Azure will automatically generate a GitHub Actions CI/CD workflow file
inside the repository. All future changes pushed to GitHub will trigger
an automated redeployment.

----------------------------------------------------------
Step 4 — Deployment Verification
----------------------------------------------------------
After 2–4 minutes:

✓ GitHub Actions completes the workflow  
✓ Azure deploys the application  
✓ You receive a temporary live URL like:

    https://<random-name>.azurestaticapps.net

Whenever you push new commits to the "main" branch, Azure will
automatically rebuild and redeploy the updated app.

----------------------------------------------------------
Summary
----------------------------------------------------------
You have now:

✓ Cloned the Dog Slideshow repository  
✓ Built the React application  
✓ Deployed it via Azure Static Web Apps  
✓ Enabled automatic CI/CD using GitHub Actions  
