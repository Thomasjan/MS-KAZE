import axios from 'axios';
require('dotenv').config();

let authToken: string | null = null;

// Login to Kaze
export const login = async (username: string, password: string): Promise<void> => {
    console.log('login()'.cyan);

    const user = {
      login: process.env.KAZE_USERNAME,
      password: process.env.KAZE_PASSWORD,
    }

    console.log('user: ', user)

    console.log(user);
  try {
    const response = await axios.post('https://app.kaze.so/api/login.json', {user}, {
        headers: {
            "Content-Type": "application/json"
        }
    } 
    );

    authToken = response.data.token;
    console.log('login ' + 'successful'.green);
    console.log('authToken: ', authToken?.red);
  } catch (error) {
    console.log('login ' + 'failed'.red)
    throw error;
  }
};

// Get the auth token
export const getAuthToken = (): string | null => {
  return authToken;
};
