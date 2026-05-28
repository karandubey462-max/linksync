import API from '../services/api';

const usernamePattern = /^[a-z0-9_]{3,20}$/;

export async function checkUsernameAvailability(username) {
  const normalized = username.trim().toLowerCase();

  if (!usernamePattern.test(normalized)) {
    return {
      valid: false,
      available: false,
      message: 'Use 3-20 letters, numbers, or underscores.',
    };
  }

  try {
    const response = await API.get(`/auth/username/${normalized}`);
    return response.data;
  } catch {
    try {
      await API.get(`/profile/public/${normalized}`);
      return {
        valid: true,
        available: false,
        message: 'Username is already taken.',
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          valid: true,
          available: true,
          message: 'Username is available.',
        };
      }

      return {
        valid: true,
        available: false,
        message: 'Could not check username right now.',
      };
    }
  }
}
