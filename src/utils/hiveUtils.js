// Utility functions for interacting with the Hive blockchain
const hive = require('@hiveio/hive-js');

// Initialize Hive API
hive.api.setOptions({ url: 'https://api.hive.blog' });

/**
 * Broadcast a custom JSON operation to the Hive blockchain
 * @param {string} username - The username of the account
 * @param {string} id - The custom JSON operation ID
 * @param {object} json - The JSON data to broadcast
 * @param {string[]} requiredAuths - List of required active authorities
 * @param {string[]} requiredPostingAuths - List of required posting authorities
 * @returns {Promise} - Returns a promise that resolves when the broadcast is complete
 */
export const broadcastCustomJson = (username, id, json, requiredAuths = [], requiredPostingAuths = [username]) => {
  return new Promise((resolve, reject) => {
    if (!window.hive_keychain) {
      reject(new Error('Hive Keychain is not installed'));
      return;
    }

    window.hive_keychain.requestCustomJson(
      username,
      id,
      requiredAuths.length > 0 ? 'Active' : 'Posting',
      JSON.stringify(json),
      id,
      (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to broadcast custom JSON'));
        }
      }
    );
  });
};

/**
 * Transfer HIVE or HBD to another account
 * @param {string} username - The sender's username
 * @param {string} to - The recipient's username
 * @param {string} amount - The amount to send (e.g., "1.000 HIVE" or "1.000 HBD")
 * @param {string} memo - The memo to attach to the transfer
 * @returns {Promise} - Returns a promise that resolves when the transfer is complete
 */
export const transferTokens = (username, to, amount, memo = '') => {
  return new Promise((resolve, reject) => {
    if (!window.hive_keychain) {
      reject(new Error('Hive Keychain is not installed'));
      return;
    }

    window.hive_keychain.requestTransfer(
      username,
      to,
      amount,
      memo,
      'HIVE',
      (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to transfer tokens'));
        }
      }
    );
  });
};

/**
 * Delegate HP (HIVE POWER) to another account
 * @param {string} username - The delegator's username
 * @param {string} delegatee - The username to delegate to
 * @param {string} amount - The amount of HP to delegate (e.g., "100.000 VESTS")
 * @returns {Promise} - Returns a promise that resolves when the delegation is complete
 */
export const delegateHP = (username, delegatee, amount) => {
  return new Promise((resolve, reject) => {
    if (!window.hive_keychain) {
      reject(new Error('Hive Keychain is not installed'));
      return;
    }

    window.hive_keychain.requestDelegation(
      username,
      delegatee,
      amount,
      (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to delegate HP'));
        }
      }
    );
  });
};

/**
 * Follow or unfollow a user
 * @param {string} username - The follower's username
 * @param {string} followee - The username to follow/unfollow
 * @param {boolean} isFollow - True to follow, false to unfollow
 * @returns {Promise} - Returns a promise that resolves when the operation is complete
 */
export const followUser = (username, followee, isFollow = true) => {
  const json = ['follow', {
    follower: username,
    following: followee,
    what: isFollow ? ['blog'] : []
  }];

  return broadcastCustomJson(username, 'follow', json);
};

/**
 * Reblog/resteem a post
 * @param {string} username - The username performing the reblog
 * @param {string} author - The author of the post
 * @param {string} permlink - The permlink of the post
 * @returns {Promise} - Returns a promise that resolves when the reblog is complete
 */
export const reblogPost = (username, author, permlink) => {
  const json = ['reblog', {
    account: username,
    author,
    permlink
  }];

  return broadcastCustomJson(username, 'reblog', json);
};

/**
 * Update account metadata (profile)
 * @param {string} username - The username
 * @param {object} metadata - The metadata object containing profile information
 * @returns {Promise} - Returns a promise that resolves when the update is complete
 */
export const updateAccountMetadata = (username, metadata) => {
  return broadcastCustomJson(username, 'account_update', metadata);
};

/**
 * Power up HIVE to HIVE POWER
 * @param {string} username - The username
 * @param {string} amount - The amount to power up (e.g., "1.000 HIVE")
 * @returns {Promise} - Returns a promise that resolves when the power up is complete
 */
export const powerUp = (username, amount) => {
  return new Promise((resolve, reject) => {
    if (!window.hive_keychain) {
      reject(new Error('Hive Keychain is not installed'));
      return;
    }

    window.hive_keychain.requestPowerUp(
      username,
      amount,
      (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to power up'));
        }
      }
    );
  });
};

/**
 * Power down HIVE POWER to HIVE
 * @param {string} username - The username
 * @param {string} amount - The amount to power down (e.g., "1.000 VESTS")
 * @returns {Promise} - Returns a promise that resolves when the power down is complete
 */
export const powerDown = (username, amount) => {
  return new Promise((resolve, reject) => {
    if (!window.hive_keychain) {
      reject(new Error('Hive Keychain is not installed'));
      return;
    }

    window.hive_keychain.requestWithdrawVesting(
      username,
      amount,
      (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to power down'));
        }
      }
    );
  });
}; 