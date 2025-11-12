import User from "../../Models/User-Model/User-Model.js";


const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

const validateImageFile = (file) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg", 
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
    };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File size too large. Maximum 5MB allowed." };
  }

  return { valid: true };
};


// 🟢 Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's enrolled courses with populated course data
export const getUserEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate(
        "enrolledCourses.course",
        "coursename category price emi thumbnail"
      )
      .populate("enrolledCourses.emiPlan")
      .select("enrolledCourses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Transform enrolled courses to include course data
    const enrolledCourses = user.enrolledCourses.map((enrollment) => ({
      _id: enrollment.course._id,
      coursename: enrollment.course.coursename,
      category: enrollment.course.category,
      price: enrollment.course.price,
      emi: enrollment.course.emi,
      thumbnail: enrollment.course.thumbnail,
      accessStatus: enrollment.accessStatus,
      emiPlan: enrollment.emiPlan,
    }));

    res.status(200).json({
      success: true,
      data: enrolledCourses,
    });
  } catch (error) {
    console.error("Error fetching user enrolled courses:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// 🟡 Update User Profile Details (except profile picture)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const {
      username, // Changed from firstName, lastName
      email,
      mobile, // Changed from mobileNumber
      fatherName, // Changed from fatherOrHusbandName
      dateofBirth, // Changed from dateOfBirth
      gender,
      bloodGroup,
      address,
      Nationality, // Added
      Occupation, // Added
    } = req.body;

    // Basic validation (you might want more comprehensive validation)
    if (!email || !username) {
      return res
        .status(400)
        .json({ success: false, message: "Username and Email are required" });
    }

    // Optional: Check if the new email already exists for another user
    if (email) {
      const existingUserWithEmail = await User.findOne({
        email: email,
        _id: { $ne: userId }, // Exclude current user
      });
      if (existingUserWithEmail) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Email already in use by another account",
          });
      }
    }

    // Optional: Check if the new username already exists for another user
    if (username) {
      const existingUserWithUsername = await User.findOne({
        username: username,
        _id: { $ne: userId }, // Exclude current user
      });
      if (existingUserWithUsername) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Username already in use by another account",
          });
      }
    }

    const updateData = {
      username,
      email,
      mobile,
      fatherName,
      dateofBirth: dateofBirth ? new Date(dateofBirth) : null, // Ensure it's a Date object or null
      gender,
      bloodGroup,
      address, // Assuming address is an object { street, city, state, country, zipCode }
      Nationality,
      Occupation,
    };

    // Remove undefined fields so they don't overwrite existing data with nulls if not provided
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );
    if (updateData.address && Object.keys(updateData.address).length === 0) {
      delete updateData.address; // Don't send empty address object unless intended
    } else if (updateData.address) {
      Object.keys(updateData.address).forEach(
        (key) =>
          updateData.address[key] === undefined &&
          delete updateData.address[key]
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, // Find user by ID
      { $set: updateData }, // Update specified fields
      { new: true, runValidators: true, context: "query" } // Options
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    // Handle Mongoose validation errors (e.g., unique constraint)
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
    }
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res
        .status(400)
        .json({
          success: false,
          message: "Email or username already exists.",
          error: error.message,
        });
    }
    res.status(500).json({
      success: false,
      message: "Update failed due to server error",
      error: error.message,
    });
  }
};


// 🔵 Update Profile Picture - Updated to use Base64
export const updateProfilePicture = async (req, res) => {
  try {
    console.log("🖼️ Uploading profile picture for userId:", req.userId);

    if (!req.userId) {
      console.log("⚠️ User ID not provided");
      return res
        .status(401)
        .json({ 
          success: false,
          message: "Unauthorized: User not authenticated" 
        });
    }

    if (!req.file) {
      console.log("⚠️ No file uploaded");
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    // Validate uploaded file
    const validation = validateImageFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    // Convert file to Base64
    let profilePictureData;
    try {
      profilePictureData = {
        data: convertToBase64(req.file),
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadDate: new Date(),
      };
      console.log("📷 Profile picture converted to Base64 successfully");
    } catch (error) {
      console.error("⚠️ Error converting image to Base64:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to process profile picture.",
      });
    }

    // Update user profile picture in database
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        profilePicture: profilePictureData,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      console.log("❌ User not found during profile picture update");
      return res
        .status(404)
        .json({ 
          success: false,
          message: "User not found, cannot update profile picture" 
        });
    }

    console.log("✅ Profile picture updated for user:", updatedUser._id);
    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    console.error("🔥 Error updating profile picture:", error);
    res
      .status(500)
      .json({ 
        success: false,
        message: "Failed to upload photo", 
        error: error.message 
      });
  }
};
