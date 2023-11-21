import axios from 'axios';

let authToken: string | null = null;

export const login = async (username: string, password: string): Promise<void> => {
    console.log('login()'.cyan);
  try {
    const response = await axios.post('https://app.kaze.so/api/login.json', {
      user: {
        login: username,
        password: password,
      },
    });

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
