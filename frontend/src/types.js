/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {'member' | 'admin' | 'pastor'} role
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} Sermon
 * @property {string} id
 * @property {string} title
 * @property {string} preacher
 * @property {Date} date
 * @property {string} youtubeId
 * @property {string} category
 * @property {string} description
 * @property {string} [notesUrl]
 * @property {number} views
 */

/**
 * @typedef {Object} PrayerRequest
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {Date} createdAt
 * @property {boolean} isAnonymous
 * @property {'pending' | 'prayed' | 'answered'} status
 */

/**
 * @typedef {Object} Donation
 * @property {string} id
 * @property {number} amount
 * @property {string} name
 * @property {string} email
 * @property {Date} date
 * @property {string} paymentMethod
 * @property {string} project
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {Date} date
 * @property {string} location
 * @property {string} description
 * @property {string} imageUrl
 */

/**
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} content
 * @property {string} avatar
 * @property {Date} date
 */

export { }
