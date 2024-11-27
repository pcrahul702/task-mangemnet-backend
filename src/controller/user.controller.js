import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../modals/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const genrateAcessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    const accessToken = await user.genrateAcessToken();
    const refreshtoken = await user.genrateRefreshToken();

    user.refreshtoken = refreshtoken;
    user.save({ validateBeforSave: false });
    return { accessToken, refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while genrating refresh and access token"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password, role, phone } = req.body;
  console.log(fullname, email, username, password, phone, role);
  if (
    [fullname, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All filed are Required");
  }

  const phoneRegex = /^\d{10}$/;
  if (!phone || !phoneRegex.test(phone)) {
    throw new ApiError(400, "Phone number must be a valid 10-digit number");
  }

  const existeduser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (!existeduser) {
    throw new ApiError(409, "user already Exist");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  console.log(avatar.url);
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    email,
    password,
    phone,
    role,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went happen during creating user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user created succusfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!password || (!username && !email)) {
    throw new ApiError(400, "Password and either username or email are required!");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }
  const IsPasswordvalid = await user.isPasswordCorrect(password);
  if (!IsPasswordvalid) {
    throw new ApiError(401, "invalid user credentials!");
  }
  const { accessToken, refreshtoken } = await genrateAcessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        "user LoggedIN successfully",
        {
          user: loggedInUser,
          accessToken,
          refreshtoken,
        },
        
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user loggedout!"));
});
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshtoken");
    if (!users.length) {
      throw new ApiError(404, "No users found.");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Users fetched successfully.", users));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch users.");
  }
});
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password -refreshtoken");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully.", user));
});
export { registerUser, loginUser, logoutUser, getAllUsers, getUserById };
