const User = require('../models/User');

const profileController = {
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      
      res.json({
        success: true,
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { firstName, lastName, phone } = req.body;
      
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            'profile.firstName': firstName,
            'profile.lastName': lastName,
            'profile.phone': phone
          }
        },
        {
          new: true,
          runValidators: true
        }
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = profileController;