import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './server/config/db';
import User from './server/models/User';
import Project from './server/models/Project';
import bcrypt from 'bcryptjs';

dotenv.config();

// Initialize database connection
connectDB().then(async () => {
  try {
    const deleted = await User.deleteMany({
      email: { $in: ['shiv@gmail.com', 'het@gmail.com'] }
    });
    if (deleted.deletedCount > 0) {
      console.log(`[ShootMate Database] Successfully removed ${deleted.deletedCount} temporary/mock profiles (shiv/het) from MongoDB.`);
    }
  } catch (err) {
    console.error('[ShootMate Database] Failed to clear temporary/mock profiles on startup:', err);
  }
});

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

interface LocationData {
  name: string;
  code: string;
  cities: string[];
  digitsCount: number;
}

let cachedLocations: LocationData[] = [];

// Fetch and merge countries, cities, and dial codes
async function loadLocations() {
  try {
    console.log('[ShootMate Backend] Fetching global countries and cities...');
    const countriesRes = await fetch('https://countriesnow.space/api/v0.1/countries');
    const codesRes = await fetch('https://countriesnow.space/api/v0.1/countries/codes');

    if (countriesRes.ok && codesRes.ok) {
      const countriesJson = await countriesRes.json() as { error: boolean; data: { country: string; cities: string[] }[] };
      const codesJson = await codesRes.json() as { error: boolean; data: { name: string; dial_code: string }[] };

      if (!countriesJson.error && !codesJson.error) {
        const merged: LocationData[] = countriesJson.data.map(c => {
          const matchedCode = codesJson.data.find(code => code.name.toLowerCase() === c.country.toLowerCase());
          let citiesList = c.cities && c.cities.length > 0 ? [...c.cities] : [];
          if (c.country.toLowerCase() === 'india') {
            const extraIndiaCities = [
              'Surat', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa',
              'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna',
              'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli',
              'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
              'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
              'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad', 'Bareilly', 'Moradabad', 'Mysore', 'Gurgaon',
              'Aligarh', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Warangal', 'Mira-Bhayandar',
              'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur', 'Guntur', 'Amravati', 'Noida', 'Bikaner', 'Kochi'
            ];
            extraIndiaCities.forEach(city => {
              if (!citiesList.some(existing => existing.toLowerCase() === city.toLowerCase())) {
                citiesList.push(city);
              }
            });
          }
          let digitsCount = 10;
          const countryLower = c.country.toLowerCase();
          if (
            countryLower === 'australia' ||
            countryLower === 'france' ||
            countryLower === 'united arab emirates' ||
            countryLower === 'austria' ||
            countryLower === 'belgium' ||
            countryLower === 'denmark' ||
            countryLower === 'greece' ||
            countryLower === 'ireland' ||
            countryLower === 'new zealand' ||
            countryLower === 'norway' ||
            countryLower === 'portugal' ||
            countryLower === 'spain' ||
            countryLower === 'switzerland' ||
            countryLower === 'sweden'
          ) {
            digitsCount = 9;
          }
          return {
            name: c.country,
            code: matchedCode ? matchedCode.dial_code : '+1',
            cities: citiesList.sort(),
            digitsCount: digitsCount
          };
        });

        cachedLocations = merged.sort((a, b) => a.name.localeCompare(b.name));
        console.log(`[ShootMate Backend] Successfully loaded ${cachedLocations.length} countries and their cities dynamically.`);
      }
    } else {
      console.warn('[ShootMate Backend] Failed response from locations API, fallback will be used.');
    }
  } catch (err) {
    console.error('[ShootMate Backend] Error loading locations dynamically:', err);
  }
}

// Trigger load on startup
loadLocations();
app.get("/", (req, res) => {
  res.send("ShootMate Backend Running 🚀");
});
app.get('/api/locations', (req: express.Request, res: express.Response) => {
  res.json(cachedLocations);
});
app.get('/test-google', (req, res) => {
  console.log('TEST GOOGLE ROUTE HIT');
  res.json({ success: true });
});
app.post('/api/auth/google', async (req: express.Request, res: express.Response) => {
  console.log("=== GOOGLE AUTH REQUEST RECEIVED ===");
  console.log("Request Body:", req.body);

  const { token } = req.body;

  if (!token) {
    console.log("No token received");
    return res.status(400).json({ error: 'Google Access Token is required' });
  }

  try {
    console.log("Validating token with Google...");

    const googleResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Google Response Status:", googleResponse.status);

    if (!googleResponse.ok) {
      const errorText = await googleResponse.text();
      console.log("Google Error:", errorText);

      return res.status(401).json({
        error: 'Failed to authenticate token with Google'
      });
    }

    const userData = await googleResponse.json() as {
      email?: string;
      name?: string;
      picture?: string;
    };

    console.log("Google User Data:", userData);

    const { email, name, picture } = userData;

    if (!email) {
      console.log("Google returned no email");
      return res.status(400).json({
        error: 'Google did not return an email'
      });
    }

    const dbUser = await User.findOne({
      email: email.toLowerCase()
    });

    console.log("DB User Found:", !!dbUser);

    return res.status(200).json({
      success: true,
      email,
      name: name || '',
      photoUrl: picture || '',
      exists: !!dbUser,
      user: dbUser || null
    });

  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);

    return res.status(500).json({
      error: 'Internal server error during Google auth'
    });
  }
});
// Register or update user profile
app.post('/api/auth/register', async (req: express.Request, res: express.Response) => {
  try {
    const userData = req.body;
    if (!userData || !userData.email) {
      return res.status(400).json({ error: 'User data and email are required' });
    }

    const normalizedUser = {
      ...userData,
      email: userData.email.toLowerCase().trim()
    };

    // Hash the password if it is provided (new registration or password update)
    if (normalizedUser.password) {
      const salt = await bcrypt.genSalt(10);
      normalizedUser.password = await bcrypt.hash(normalizedUser.password, salt);
    } else {
      // Avoid overwriting password with empty values during profile edits
      delete normalizedUser.password;
    }

    const user = await User.findOneAndUpdate(
      { email: normalizedUser.email },
      { $set: normalizedUser },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('[ShootMate Backend] Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login via Email + Password
app.post('/api/auth/login', async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ error: 'No registered account found with this email.' });
    }

    if (!user.password) {
      return res.status(400).json({ error: 'This email is registered via Google OAuth. Please sign in via Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('[ShootMate Backend] Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Retrieve all professional accounts
app.get('/api/professionals', async (req: express.Request, res: express.Response) => {
  try {
    const professionals = await User.find({ role: 'professional' });
    return res.status(200).json(professionals);
  } catch (err) {
    console.error('[ShootMate Backend] Fetch professionals error:', err);
    return res.status(500).json({ error: 'Internal server error fetching professionals' });
  }
});

// Save a new project booking
app.post('/api/projects', async (req: express.Request, res: express.Response) => {
  const { id, title, date, creatorId, professionalId } = req.body;
  if (!id || !title || !date || !creatorId || !professionalId) {
    return res.status(400).json({ error: 'All project fields are required: id, title, date, creatorId, professionalId' });
  }

  try {
    const newProject = new Project({ id, title, date, creatorId, professionalId });
    await newProject.save();

    // Increment total projects completed for professional
    await User.findOneAndUpdate(
      { id: professionalId },
      { $inc: { projectsCompleted: 1 } }
    );

    return res.status(200).json({ success: true, project: newProject });
  } catch (err) {
    console.error('[ShootMate Backend] Project creation error:', err);
    return res.status(500).json({ error: 'Internal server error during project creation' });
  }
});

// Retrieve projects associated with a user
app.get('/api/projects', async (req: express.Request, res: express.Response) => {
  const { creatorId, professionalId } = req.query;
  try {
    let query: any = {};
    if (creatorId) {
      query.creatorId = creatorId;
    } else if (professionalId) {
      query.professionalId = professionalId;
    } else {
      return res.status(400).json({ error: 'Please provide either creatorId or professionalId query parameter' });
    }

    const projects = await Project.find(query);
    return res.status(200).json(projects);
  } catch (err) {
    console.error('[ShootMate Backend] Fetch projects error:', err);
    return res.status(500).json({ error: 'Internal server error fetching projects' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[ShootMate Backend] Server running on port ${PORT}`);
});
