import settings from './settings.js';
import { getAuthUser } from '../databases/authdb.js'
import { GraphQLError } from 'graphql'

const limiterSettings = settings.rateLimiterSettings;
const getLimiterWindow = () => Math.floor(Date.now() / limiterSettings.windowSizeInMillis);

export const rateLimiter = (authUser) => {

  const user = getAuthUser(authUser);

  // If user has no rate-limit metadata, set it up
  if (!user.rateLimiting) {
    user.rateLimiting = {
      window: getLimiterWindow(),
      requestCounter: 0
    };
  }

  // Current window based on time
  const currentWindow = getLimiterWindow();

  // If we've moved into a new window, reset tracking
  if (user.rateLimiting.window < currentWindow) {
    user.rateLimiting.window = currentWindow;
    user.rateLimiting.requestCounter = 1;
  } else {
    // Still in the same window → count request
    user.rateLimiting.requestCounter++;
  }

  // How many requests remain in the current window
  const remaining = limiterSettings.limit - user.rateLimiting.requestCounter;

  // Block the user if they exceeded the limit
  if (user.rateLimiting.requestCounter > limiterSettings.limit) {
     throw new GraphQLError('You have exceeded your request limit. Please wait...', {
       extensions: {
          code: "RATE LIMIT EXCEEDED",
          http: { status: 429 }
       }
     })
  }
 
  return {
    user,
    rateLimit: {
      limit: limiterSettings.limit,
      remaining: Math.max(remaining, 0)
    }
  }
};
