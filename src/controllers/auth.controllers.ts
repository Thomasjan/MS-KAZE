import axios from 'axios';
require('dotenv').config();

let authToken: string | null = null;

export const login = async (username: string, password: string): Promise<void> => {
    console.log('login()'.cyan);

    const user = {
      login: 'thomas.jankowski@gestimum.com',
      password: 'kaze_password',
      // login: process.env.KAZE_USERNAME,
      // password: process.env.KAZE_PASSWORD,
    }

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

export const getAuthToken = (): string | null => {
  return authToken;
};
